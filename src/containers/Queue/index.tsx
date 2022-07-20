import type { FC } from 'react'

import { useClient, usePlayInfo } from '@stores'
import style from './index.module.scss'

export const Queue: FC<any> = () => {
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
    </div>
  )
}
