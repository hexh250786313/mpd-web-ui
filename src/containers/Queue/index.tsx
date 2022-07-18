import { useI18n, usePlayInfo, useClient } from '@stores'
import React, { useMemo } from 'react'
import style from './index.module.scss'

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

  return (
    <div>
      <h1>{playInfo?.currentSong?.title}</h1>
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
    </div>
  )
}
