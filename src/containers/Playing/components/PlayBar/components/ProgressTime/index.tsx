import { convertTime } from '@lib/helper'
import { playInfoAtom, progressAtom } from '@stores'
import { useAtomValue } from 'jotai'

export function ProgressTime() {
  const progress = useAtomValue(progressAtom)
  const playInfo = useAtomValue(playInfoAtom)

  return (
    <div>
      {convertTime(progress)} / {convertTime(playInfo?.playing?.time?.total)}
    </div>
  )
}
