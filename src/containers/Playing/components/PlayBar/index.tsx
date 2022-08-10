import type { IPlaying } from '@types'

import {
  useAPIInfo,
  useClient,
  useI18n,
  usePlayInfo,
  usePlayingStreamReader,
} from '@stores'
import { useLayoutEffect, useMemo } from 'react'
import { ProgressBar, ProgressTime } from './components'

export function PlayBar() {
  const client = useClient()
  const apiInfo = useAPIInfo()
  const { playInfo, update } = usePlayInfo()
  const { translation } = useI18n()
  const t = useMemo(() => translation('Playing').t, [translation])
  const { streamReader } = usePlayingStreamReader()

  const setPlaying = () => {
    update()
  }

  useLayoutEffect(() => {
    streamReader.unsubscribe('mpd-player', setPlaying)
    streamReader.subscribe('mpd-player', setPlaying)
    return () => {
      streamReader.unsubscribe('mpd-player', setPlaying)
    }
  }, [streamReader, apiInfo])

  return (
    <div>
      <h1>
        {playInfo?.current?.artist} - {playInfo?.current?.title}
      </h1>
      <ProgressTime />
      <ProgressBar />
      <button onClick={() => client.playback.prev()}>{t('prev')}</button>
      <button onClick={() => client.playback.stop()}>{t('stop')}</button>
      <button onClick={() => client.playback.toggle()}>{t('toggle')}</button>
      <button onClick={() => client.playback.next()}>{t('next')}</button>
    </div>
  )
}
