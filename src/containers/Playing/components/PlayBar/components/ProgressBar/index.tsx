import type { FC } from 'react'

import styles from './index.module.scss'
import { useEffect, useRef, useState } from 'react'
import { useClient, useProgress } from '@stores'

export const ProgressBar: FC = () => {
  const { progress, total, set: setProgress } = useProgress()
  const [x, setX] = useState(0)
  const barRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<boolean>(false)
  const xRef = useRef<number>(0)
  const client = useClient()

  const handleMouseMove = ({ clientX }: MouseEvent) => {
    if (dragRef.current && barRef.current) {
      document.ondragstart = () => false
      const { left, width } = barRef.current.getBoundingClientRect()
      const nextX = (clientX - left) / width
      const x = Math.min(1, Math.max(0, nextX))
      if (total) {
        setProgress(Math.floor(x * total), 'stop')
      }
      setX(x)
      xRef.current = x
    }
  }

  const handleMouseUp = async () => {
    if (dragRef.current && barRef.current && total) {
      console.log('handleMouseUp', total)
      if (total) {
        const nextProgress = Math.floor(xRef.current * total)
        await client.playback.seekcur(nextProgress)
        setProgress(nextProgress)
      }
      dragRef.current = false
      document.ondragstart = () => true
    }
  }

  useEffect(() => {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [total])

  useEffect(() => {
    // console.log(progress, total)
    if (typeof total === 'number' && typeof progress === 'number') {
      setX(progress / total)
    } else {
      setX(0)
    }
  }, [progress, total])

  return (
    <div>
      <div className={styles.bar} ref={barRef}>
        <div
          onMouseDown={(e) => {
            e.stopPropagation()
            dragRef.current = true
          }}
          className={styles.knob}
          style={{ left: (x ?? 0) * 100 + '%' }}
        />
      </div>
    </div>
  )
}
