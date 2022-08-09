import type { IPlaying } from '@types'

import {
  useClient,
  useI18n,
  usePlayInfo,
  usePlayingStreamReader,
} from '@stores'
import { useLayoutEffect, useMemo } from 'react'
import { Progress } from './components'

export function PlayBar() {
  const client = useClient()
  const { playInfo, update } = usePlayInfo()
  const { translation } = useI18n()
  const t = useMemo(() => translation('Playing').t, [translation])
  const { streamReader, set } = usePlayingStreamReader()

  const setStatus = (data: IPlaying) => {
    update()
    set(data)
  }

  useLayoutEffect(() => {
    streamReader.unsubscribe('mpd-player', setStatus)
    streamReader.subscribe('mpd-player', setStatus)
    return () => {
      streamReader.unsubscribe('mpd-player', setStatus)
    }
  }, [streamReader])

  return (
    <div>
      <h1>
        {playInfo?.current?.artist} - {playInfo?.current?.title}
      </h1>
      <Progress
        elapsed={playInfo?.playing?.time?.elapsed}
        total={playInfo?.playing?.time?.total}
        status={playInfo?.playing?.state}
      />
      <button onClick={() => client.playback.prev()}>{t('prev')}</button>
      <button onClick={() => client.playback.stop()}>{t('stop')}</button>
      <button onClick={() => client.playback.toggle()}>{t('toggle')}</button>
      <button onClick={() => client.playback.next()}>{t('next')}</button>
    </div>
  )
}
