import { useClient } from '@stores/request'
import { Result } from 'neverthrow'
import React, { useMemo } from 'react'
import style from './index.module.scss'

export const Test: React.FC<any> = () => {
  const client = useClient()

  const mainErrorFn = () => {
    if (Math.random() > 0.5) {
      console.log('OK')
      return 'OK'
    }
    throw new Error('Failed')
  }

  const test = Result.fromThrowable(mainErrorFn, (e) => e as Error)

  console.log(test())

  const play = useMemo(() => {
    return async () => {
      const res = await client.playback.play()
      console.log('play', res)
    }
  }, [client])

  const pause = useMemo(() => {
    return async () => {
      const res = await client.playback.pause()
      console.log('pause', res)
    }
  }, [client])

  const dbUpdate = useMemo(() => {
    return async () => {
      const res = await client.db.update()
      console.log('DB Update', res)
    }
  }, [client])

  const stop = useMemo(() => {
    return async () => {
      const res = await client.playback.stop()
      console.log('test', res)
    }
  }, [client])

  const next = useMemo(() => {
    return async () => {
      const res = await client.playback.next()
      console.log('next', res)
    }
  }, [client])

  const prev = useMemo(() => {
    return async () => {
      const res = await client.playback.prev()
      console.log('prev', res)
    }
  }, [client])

  const info = useMemo(() => {
    return async () => {
      const res = await client.queue.info()
      console.log('info', res)
    }
  }, [client])

  return (
    <div className={style.test}>
      <button onClick={() => play()}>play</button>
      <button onClick={() => pause()}>pause</button>
      <button onClick={() => dbUpdate()}>dbUpdate</button>
      <button onClick={() => stop()}>stop</button>
      <button onClick={() => next()}>next</button>
      <button onClick={() => prev()}>prev</button>
      <button onClick={() => info()}>info</button>
    </div>
  )
}
