import { convertTime } from '@lib/helper'
import { useClient, useI18n, usePlayInfo, useStatusStreamReader } from '@stores'
import { useLayoutEffect, useMemo } from 'react'

export function PlayBar() {
  const client = useClient()
  const { playInfo, update } = usePlayInfo()
  const { translation } = useI18n()
  const t = useMemo(() => translation('Playing').t, [translation])
  const { triggerReport, stopReport, streamReader, status } =
    useStatusStreamReader()

  useLayoutEffect(() => {
    if (streamReader.connected) {
      triggerReport()
    } else {
      streamReader.subscribe('ok', triggerReport)
    }
    return () => {
      streamReader.unsubscribe('ok', triggerReport)
      if (streamReader.connected) {
        stopReport()
      }
    }
  }, [streamReader])

  const currentSong = playInfo?.queueInfo.find(
    ({ id }) => id === status?.songid ?? ''
  )

  return (
    <div>
      <h1>
        {
          // {currentSong?.title} - {currentSong?.artist}
        }
        {playInfo?.currentSong?.artist} - {playInfo?.currentSong?.title}
      </h1>
      <div>
        {convertTime(status?.time?.elapsed)} /{' '}
        {convertTime(status?.time?.total)}
      </div>
      <button onClick={() => client.playback.prev().then(() => update())}>
        {t('prev')}
      </button>
      <button onClick={() => client.playback.stop().then(() => update())}>
        {t('stop')}
      </button>
      <button onClick={() => client.playback.toggle().then(() => update())}>
        {t('toggle')}
      </button>
      <button onClick={() => client.playback.next().then(() => update())}>
        {t('next')}
      </button>
      <button onClick={() => triggerReport()}>sendWS</button>
      <button onClick={() => stopReport()}>stopWS</button>
    </div>
  )
}
