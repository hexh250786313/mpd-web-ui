import type { FC } from 'react'

import { useAlbums, useI18n } from '@stores'
import { useMemo } from 'react'
import style from './index.module.scss'

export const Albums: FC<any> = () => {
  const { translation } = useI18n()
  const t = useMemo(() => translation('Albums').t, [translation])
  const { albums } = useAlbums()

  console.log(albums)

  return (
    <div className={style.test}>
      <div>{t('title')}</div>
      <ul>
        {albums.map((album, index) => (
          <li key={index}>{album}</li>
        ))}
      </ul>
    </div>
  )
}
