import { useI18n } from '@stores'
import React, { useMemo } from 'react'
import style from './index.module.scss'

export const Queue: React.FC<any> = () => {
  const { translation } = useI18n()
  const t = useMemo(() => translation('Queue').t, [translation])

  return (
    <div className={style.test}>
      <p>{t('controllBar.moveUp')}</p>
      <p>{t('controllBar.moveDown')}</p>
    </div>
  )
}
