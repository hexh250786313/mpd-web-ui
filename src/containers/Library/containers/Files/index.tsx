import type { FC } from 'react'

import { useFiles, useI18n } from '@stores'
import { useMemo } from 'react'
import style from './index.module.scss'

export const Files: FC<any> = () => {
  const { translation } = useI18n()
  const t = useMemo(() => translation('Files').t, [translation])
  const { files } = useFiles()

  console.log(files)

  return (
    <div className={style.test}>
      <div>{t('title')}</div>
      <ul>
        {files.map((file, index) => (
          <li key={index}>{file}</li>
        ))}
      </ul>
    </div>
  )
}
