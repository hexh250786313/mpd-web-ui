import { useI18n, usePlayInfo, useClient, useStatusStreamReader } from '@stores'
import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import style from './index.module.scss'

function convertTime(time?: number) {
  if (time === undefined) {
    return ''
  }
  const minute = Math.floor(time / 60)
  const second = Math.floor(time % 60)
  return `${minute}:${second < 10 ? '0' : ''}${second}`
}

export const Queue: React.FC<any> = () => {
  const { playInfo, update } = usePlayInfo()
  const client = useClient()

  return (
    <div className={style.test}>
      <ul>
        {playInfo.queueInfo.map((song, index) => (
          <li
            key={index}
            onClick={() => client.playback.play(song.pos).then(() => update())}
          >
            {song.title}
          </li>
        ))}
      </ul>
      <PlayBar />
    </div>
  )
}

function PlayBar() {
  const client = useClient()
  const { playInfo, update } = usePlayInfo()
  const { translation } = useI18n()
  const t = useMemo(() => translation('Playing').t, [translation])
  const { triggerReport, stopReport, streamReader, status } =
    useStatusStreamReader()

  useLayoutEffect(() => {
    streamReader.subscribe('ok', triggerReport)
    return () => {
      streamReader.unsubscribe('ok', triggerReport)
      if (import.meta.env.MODE !== 'development') {
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
