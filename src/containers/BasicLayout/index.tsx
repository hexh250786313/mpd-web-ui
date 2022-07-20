import type { FC, PropsWithChildren } from 'react'
import { SideBar } from './components/SideBar'

import style from './index.module.scss'

export const BasicLayout: FC<PropsWithChildren> = function (props) {
  return (
    <>
      <div>
        <SideBar />
      </div>
      <div className={style.test}>{props.children}</div>
    </>
  )
}
