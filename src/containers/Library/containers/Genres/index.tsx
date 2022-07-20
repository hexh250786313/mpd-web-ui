import type { FC } from 'react'

import { useGenres, useI18n } from '@stores'
import { useMemo } from 'react'
import style from './index.module.scss'

export const Genres: FC<any> = () => {
  const { translation } = useI18n()
  const t = useMemo(() => translation('Genres').t, [translation])
  const { genres } = useGenres()

  console.log(genres)

  return (
    <div className={style.test}>
      <div>{t('title')}</div>
      <ul>
        {genres.map((genre, index) => (
          <li key={index}>{genre}</li>
        ))}
      </ul>
    </div>
  )
}
