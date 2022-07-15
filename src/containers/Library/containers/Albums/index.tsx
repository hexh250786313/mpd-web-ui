import { useI18n } from '@stores'
import React, { useMemo } from 'react'
import style from './index.module.scss'

export const Albums: React.FC<any> = () => {
  const { translation } = useI18n()
  const t = useMemo(() => translation('Albums').t, [translation])

  return <div className={style.test}>Albums</div>
}
