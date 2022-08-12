import type { Lang } from '@i18n'
import type { ISong, IPlaying, Tag } from '@types'
import type { Get } from 'type-fest'
import type { KeyedMutator } from 'swr'
import type { WritableAtom } from 'jotai'

import { getDefaultLanguage, Language, locales } from '@i18n'
import { useInterval, useWarpImmerSetter } from '@lib/jotai'
import { atom, useAtom, useAtomValue } from 'jotai'
import { atomWithImmer } from 'jotai/immer'
import { atomWithStorage } from 'jotai/utils'
import { get } from 'lodash-es'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useSWR from 'swr'
import { useAPIInfo, useClient } from '@stores/request'
import { StreamReader } from '@lib/streamer'
import { useSyncedRef } from '@react-hookz/web'

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
  queue: [] as ISong[],
  current: null as ISong | null,
  playing: null as IPlaying | null,
})

export function usePlayInfo() {
  const [playInfo, setPlayInfo] = useAtom(playInfoAtom)
  const set = useWarpImmerSetter(setPlayInfo)
  const client = useClient()

  const { mutate } = useSWR(
    ['/mpd/status', client],
    async () => {
      const response = await client.status.get()
      const playInfo = {
        queue: response.data.queue,
        current: response.data.current,
        playing: response.data.playing,
      }
      set(playInfo)
    },
    {
      refreshInterval: 10000,
    }
  )

  return {
    playInfo,
    set,
    update: mutate,
  }
}

const playingStreamReaderAtom = atom(new StreamReader())

export function usePlayingStreamReader() {
  const apiInfo = useAPIInfo()
  const streamReader = useAtomValue(playingStreamReaderAtom)
  const protocol = apiInfo.protocol === 'http:' ? 'ws:' : 'wss:'

  const apiInfoRef = useSyncedRef(apiInfo)

  useEffect(() => {
    const url = `${protocol}//${apiInfo.hostname}:${apiInfo.port}/`
    streamReader.connect(url)
  }, [apiInfoRef, streamReader])

  return {
    streamReader,
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
      const queueInfoResponse = await client.db.list<Tag>(key)
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

export const progressAtom = atom<number | undefined>(0)

export function useProgress() {
  const { playInfo } = usePlayInfo()
  const stagedRef = useRef<number | undefined>(undefined)
  const [progress, setProgress] = useAtom(progressAtom)
  const total = playInfo?.playing?.time?.total
  const status = playInfo?.playing?.state
  const elapsed = playInfo?.playing?.time?.elapsed
  const [intervalRunning, setIntervalRunning] = useState(true)

  useEffect(() => {
    if (typeof stagedRef.current !== 'number' && !intervalRunning) {
      setIntervalRunning(true)
    }
  }, [intervalRunning, progress, stagedRef.current])

  useEffect(() => {
    if (typeof elapsed === 'number' && stagedRef.current === undefined) {
      setProgress(elapsed)
    }
  }, [playInfo])

  function set(next: number, status = 'run') {
    if (typeof next === 'number') {
      if (status === 'run') {
        console.log('A')
        setIntervalRunning(false)
        stagedRef.current = undefined
        setProgress(next)
      } else {
        stagedRef.current = next
      }
    }
  }

  useInterval(
    () => {
      if (status === 'play') {
        let next = typeof progress === 'number' ? progress + 1 : 0
        if (typeof total === 'number' && next > total) {
          next = total
        }
        setProgress(next)
      }
    },
    intervalRunning ? 1000 : null
  )

  useEffect(() => {
    setIntervalRunning(false)
    setProgress(elapsed ?? 0)
  }, [playInfo?.playing?.songid])

  return { progress, total, set }
}
