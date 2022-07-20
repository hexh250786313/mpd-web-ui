import type { FC, PropsWithChildren } from 'react'

import { useI18n } from '@stores'
import { useMemo } from 'react'
import style from './index.module.scss'
import { TopBar } from './components'

export * from './containers/Albums'
export * from './containers/Artists'
export * from './containers/Genres'
export * from './containers/Files'
export * from './containers/Search'

export const Library: FC<PropsWithChildren> = ({ children }) => {
  const { translation } = useI18n()
  const t = useMemo(() => translation('Library').t, [translation])

  return (
    <div className={style.test}>
      <TopBar />
      {children}
    </div>
  )
}
