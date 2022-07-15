import { useI18n } from '@stores'
import React, { useMemo } from 'react'
import style from './index.module.scss'

export * from './containers/Albums'
export * from './containers/Artists'
export * from './containers/Genres'
export * from './containers/Files'
export * from './containers/Search'

export const Library: React.FC<any> = () => {
  const { translation } = useI18n()
  const t = useMemo(() => translation('Library').t, [translation])

  return <div className={style.test}>Library</div>
}
