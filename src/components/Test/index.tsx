import { useTestJotaiStore } from '@stores'
import React from 'react'
import style from './index.module.scss'
import useSWR from 'swr'

export const Test: React.FC<any> = () => {
  const { data, set } = useTestJotaiStore()
  const result = useSWR(['/api/test', data.a], async () => {
    return new Promise((resolve) => {
      console.log('fetch')
      setTimeout(() => {
        resolve({ a: 0, b: 99 })
      }, 200)
    })
  })

  console.log(result)

  return (
    <div className={style.test}>
      <p>{data.a}</p>
      <p>{data.b}</p>
      <button onClick={() => set({ a: 'aa', b: 'bb' })}>click</button>
    </div>
  )
}
