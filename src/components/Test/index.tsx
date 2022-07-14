import { useTestJotaiStore } from '@stores'
import React from 'react'
import style from './index.module.scss'
import useSWR from 'swr'
import { ResultAsync, Result } from 'neverthrow'

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

  // const promise = new Promise((res, rej) => {
  // Math.random() > 0.5 ? res(1) : rej(2)
  // })

  // const test = ResultAsync.fromPromise(promise, (e) => e as Error)

  const mainErrorFn = () => {
    if (Math.random() > 0.5) {
      console.log('OK')
      return 'OK'
    }
    throw new Error('Failed')
  }

  // const test = Result.fromThrowable(mainErrorFn)
  const test = Result.fromThrowable(mainErrorFn, (e) => e as Error)

  console.log(test())

  console.log(result)

  return (
    <div className={style.test}>
      <p>{data.a}</p>
      <p>{data.b}</p>
      <button onClick={() => set({ a: 'aa', b: 'bb' })}>click</button>
    </div>
  )
}
