import type { Lang } from '@i18n'
import type { ISong, IStatus, Tag } from '@types'
import type { Get } from 'type-fest'
import type { KeyedMutator } from 'swr'
import type { WritableAtom } from 'jotai'

import { getDefaultLanguage, Language, locales } from '@i18n'
import { useWarpImmerSetter } from '@lib/jotai'
import { atom, useAtom, useAtomValue } from 'jotai'
import { atomWithImmer } from 'jotai/immer'
import { atomWithStorage } from 'jotai/utils'
import { get } from 'lodash-es'
import { useCallback, useEffect, useMemo } from 'react'
import useSWR from 'swr'
import { useAPIInfo, useClient } from '@stores/request'
import { StreamReader } from '@lib/streamer'
import { useSyncedRef } from '@react-hookz/web'
import { useState } from 'react'

interface LibraryListHook<T extends Tag> {
  (): {
    update: KeyedMutator<void>
  } & Record<`${T}s`, string[]>
}

const languageAtom = atomWithStorage<Lang | undefined>('language', undefined)

export function useI18n() {
  const [defaultLang, setLang] = useAtom(languageAtom)
  const lang = useMemo(() => defaultLang ?? getDefaultLanguage(), [defaultLang])

  const translation = useCallback(
    function <Namespace extends keyof typeof Language['en_US']>(
      namespace?: Namespace
    ) {
      function t<Path extends string>(
        path: Path
      ): Get<typeof Language['en_US'][Namespace], Path> {
        return namespace ? get(Language[lang][namespace], path) : ''
      }
      return { t }
    },
    [lang]
  )

  return { lang, locales, setLang, translation }
}

export const playInfoAtom = atomWithImmer({
  queueInfo: [] as ISong[],
  currentSong: undefined as ISong | undefined,
})

export function usePlayInfo() {
  const [playInfo, setPlayInfo] = useAtom(playInfoAtom)
  const set = useWarpImmerSetter(setPlayInfo)
  const client = useClient()

  const { mutate } = useSWR(['/playinfo', client], async () => {
    const queueInfoResponse = await client.queue.info()
    const currentSongResponse = await client.status.currentSong()
    const rawQueueInfo = queueInfoResponse.data
    const rawCurrentSong = currentSongResponse.data
    const playInfo = {
      queueInfo: rawQueueInfo,
      currentSong: rawCurrentSong,
    }
    set(playInfo)
  })

  return {
    playInfo,
    set,
    update: mutate,
  }
}

const statusStreamReaderAtom = atom(new StreamReader())

export function useStatusStreamReader() {
  const apiInfo = useAPIInfo()
  const streamReader = useAtomValue(statusStreamReaderAtom)
  const protocol = apiInfo.protocol === 'http:' ? 'ws:' : 'wss:'
  const [status, setStatus] = useState<IStatus | null>(null)

  const apiInfoRef = useSyncedRef(apiInfo)

  useEffect(() => {
    const handleReceivedStatus = (data: any) => {
      setStatus(data)
    }

    const url = `${protocol}//${apiInfo.hostname}:${apiInfo.port}/`
    streamReader.connect(url)
    streamReader.subscribe('data', handleReceivedStatus)
    return () => {
      streamReader.unsubscribe('data', handleReceivedStatus)
    }
  }, [apiInfoRef, streamReader])

  const triggerReport = () =>
    streamReader.send(JSON.stringify({ channel: 'mpd', packet: 'report' }))

  const stopReport = () =>
    streamReader.send(JSON.stringify({ channel: 'mpd', packet: 'deport' }))

  return {
    triggerReport,
    stopReport,
    streamReader,
    status,
  }
}

const generateLibraryListHook: <T extends Tag>(
  key: T,
  atom: WritableAtom<string[], string[] | ((draft: string[]) => void), void>
) => LibraryListHook<T> = (key, atom) => {
  return function () {
    const [me, setMe] = useAtom(atom)
    const client = useClient()
    const set = useWarpImmerSetter(setMe)

    const { mutate } = useSWR([`/list/${key}s`, client], async () => {
      const queueInfoResponse = await client.db.about<Tag>(key)
      const rawMes = queueInfoResponse.data.map((item) => item[key])

      set(rawMes)
    })

    return { [`${key}s`]: me, update: mutate } as any
  }
}

const albumAtom = atomWithImmer<string[]>([])
const artistsAtom = atomWithImmer<string[]>([])
const genresAtom = atomWithImmer<string[]>([])
const filesAtom = atomWithImmer<string[]>([])

export const useAlbums = generateLibraryListHook('album', albumAtom)
export const useArtists = generateLibraryListHook('artist', artistsAtom)
export const useGenres = generateLibraryListHook('genre', genresAtom)
export const useFiles = generateLibraryListHook('file', filesAtom)
