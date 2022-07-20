import type { FC } from 'react'

import { useI18n } from '@stores'
import { useMemo } from 'react'
import style from './index.module.scss'

export const Search: FC<any> = () => {
  const { translation } = useI18n()
  const t = useMemo(() => translation('Search').t, [translation])

  return <div className={style.test}>Search</div>
}
