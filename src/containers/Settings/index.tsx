import { useTestJotaiStore } from '@stores'
import React from 'react'
import style from './index.module.scss'

export const Settings: React.FC<any> = () => {
  const { data, set } = useTestJotaiStore()

  return (
    <div className={style.test}>
      <p>{data.a}</p>
      <p>{data.b}</p>
      <button onClick={() => set({ a: 'aa', b: 'bb' })}>click</button>
    </div>
  )
}
