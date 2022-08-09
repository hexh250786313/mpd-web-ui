import { convertTime } from '@lib/helper'
import { useInterval } from '@lib/jotai'
import { useEffect, useState } from 'react'

export function Progress({
  elapsed,
  total,
  status,
}: {
  elapsed?: number
  total?: number
  status: string
}) {
  const [progress, setProgress] = useState<undefined | number>(elapsed)

  useInterval(
    () => {
      if (status === 'play') {
        let next = typeof progress === 'number' ? progress + 1 : 0
        if (typeof total === 'number' && next > total) {
          next = total
        }
        setProgress(next)
      }
    },
    1000,
    [elapsed, total, status]
  )
  useEffect(() => {
    setProgress(typeof progress === 'number' ? elapsed : 0)
  }, [elapsed, total])

  return (
    <div>
      {convertTime(progress)} / {convertTime(total)}
    </div>
  )
}
