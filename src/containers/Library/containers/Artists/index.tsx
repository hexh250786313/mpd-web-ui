import type { FC } from 'react'

import { useArtists, useI18n } from '@stores'
import { useMemo } from 'react'
import style from './index.module.scss'

export const Artists: FC<any> = () => {
  const { translation } = useI18n()
  const t = useMemo(() => translation('Artists').t, [translation])
  const { artists } = useArtists()

  console.log('artists', artists)

  return (
    <div className={style.test}>
      <div>{t('title')}</div>
      <ul>
        {artists.map((artist, index) => (
          <li key={index}>{artist}</li>
        ))}
      </ul>
    </div>
  )
}
