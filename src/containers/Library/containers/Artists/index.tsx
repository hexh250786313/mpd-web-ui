import type { FC } from 'react'

import { useI18n } from '@stores'
import { useMemo } from 'react'
import style from './index.module.scss'

export const Artists: FC<any> = () => {
  const { translation } = useI18n()
  const t = useMemo(() => translation('Artists').t, [translation])

  return <div className={style.test}>Artists</div>
}
