import type { Lang } from '@i18n'
import type { ISong } from '@types'
import type { Get } from 'type-fest'

import { getDefaultLanguage, Language, locales } from '@i18n'
import { useWarpImmerSetter } from '@lib/jotai'
import { useAtom } from 'jotai'
import { atomWithImmer } from 'jotai/immer'
import { atomWithStorage } from 'jotai/utils'
import { get } from 'lodash-es'
import { useCallback, useMemo } from 'react'
import useSWR from 'swr'
import { useClient } from './request'

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
