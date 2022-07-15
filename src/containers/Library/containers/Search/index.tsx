import { useI18n } from '@stores'
import React, { useMemo } from 'react'
import style from './index.module.scss'

export const Search: React.FC<any> = () => {
  const { translation } = useI18n()
  const t = useMemo(() => translation('Search').t, [translation])

  return <div className={style.test}>Search</div>
}
