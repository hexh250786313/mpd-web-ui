import { useI18n } from '@stores'
import React, { useMemo } from 'react'
import style from './index.module.scss'

export const Playlists: React.FC<any> = () => {
  const { translation } = useI18n()
  const t = useMemo(() => translation('Playlists').t, [translation])

  return <div className={style.test}>Playlists</div>
}
