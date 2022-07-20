import type { FC } from 'react'

import { useI18n } from '@stores'
import { useMemo } from 'react'
import style from './index.module.scss'

export const Files: FC<any> = () => {
  const { translation } = useI18n()
  const t = useMemo(() => translation('Files').t, [translation])

  return <div className={style.test}>Files</div>
}
