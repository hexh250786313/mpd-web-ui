import React, { PropsWithChildren } from 'react'
import style from './index.module.scss'

export const BasicLayout: React.FC<PropsWithChildren> = function (props) {
  return (
    <>
      <div>Layout:</div>
      <div className={style.test}>{props.children}</div>
    </>
  )
}
