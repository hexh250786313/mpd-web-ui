import type { FC } from 'react'

import { useEffect, useRef, useState } from 'react'
import { useClient, useVolume } from '@stores'
import styles from './index.module.scss'

export const Volume: FC = () => {
  const client = useClient()
  const { volume } = useVolume()
  const [x, setX] = useState(volume)
  const percentage = x ?? 0 + '%'

  const barRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<boolean>(false)

  const changeVolume = (nextVolume?: number) => {
    async function change() {
      if (typeof nextVolume === 'number') {
        await client.playback.seekcur(nextVolume)
      }
    }

    change()
  }

  // const handleMouseMove = ({ clientX }: MouseEvent) => {
  // if (barRef.current) {
  // setMouseX(clientX)
  // xRef.current = getX(barLeft, barWidth, clientX)
  // }
  // if (dragRef.current) {
  // document.ondragstart = () => false
  // setAnimationEnabled(false)
  // if (total) {
  // setProgress(getNextProgress(xRef.current, total), 'stop')
  // }
  // setX(xRef.current)
  // }
  // }

  // const handleMouseUp = async () => {
  // if (dragRef.current && barRef.current) {
  // await set()
  // dragRef.current = false
  // // setAnimationEnabled(true)
  // document.ondragstart = () => true
  // }
  // }

  useEffect(() => {
    if (typeof volume === 'number') {
      setX(volume)
    }
  }, [volume])

  // useEffect(() => {
  // window.removeEventListener('mousemove', handleMouseMove)
  // window.removeEventListener('mouseup', handleMouseUp)
  // window.addEventListener('mousemove', handleMouseMove)
  // window.addEventListener('mouseup', handleMouseUp)
  // return () => {
  // window.removeEventListener('mousemove', handleMouseMove)
  // window.removeEventListener('mouseup', handleMouseUp)
  // }
  // }, [])

  return (
    <div>
      {typeof volume === 'number' ? (
        <div className={styles.bar}>
          <div className={styles.knob} style={{ left: percentage }} />
        </div>
      ) : (
        'no output'
      )}
    </div>
  )
}
