import React from 'react'
import style from './index.module.scss'
import { Test } from '@components'

export const Login: React.FC<any> = () => {
  return (
    <>
      <div className={style.test}>bye, world!</div>
      <Test />
    </>
  )
}
