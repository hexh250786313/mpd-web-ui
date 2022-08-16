import type { FC } from 'react'

import styles from './index.module.scss'
import { useEffect, useRef, useState, useCallback } from 'react'
import { playInfoAtom, useClient, useProgress } from '@stores'
import { animated, useSpring } from 'react-spring'
import { useAtomValue } from 'jotai'
import { convertTime } from '@lib/helper'
import {
  getNextProgress,
  getTimeLeft,
  getX,
  tension,
  timeWidth,
} from './helpers'

export const ProgressBar: FC = () => {
  const playInfo = useAtomValue(playInfoAtom)

  const client = useClient()
  const { progress, total, set: setProgress } = useProgress()

  const [x, setX] = useState(0)
  const [animationEnabled, setAnimationEnabled] = useState(true)
  const [mouseX, setMouseX] = useState<number>(0)
  const [timeVisibility, setTimeVisibility] = useState(false)

  const barRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<boolean>(false)
  const xRef = useRef<number>(0)
  const barWidth = barRef.current
    ? barRef.current.getBoundingClientRect().width
    : 0
  const barLeft = barRef.current
    ? barRef.current.getBoundingClientRect().left
    : 0
  const mouseXRatio = barRef.current ? getX(barLeft, barWidth, mouseX) : 0

  const percentage = (x ?? 0) * 100 + '%'
  const progressAnimationProps = useSpring({
    width: percentage,
    config: {
      tension,
      friction: 20,
    },
  })

  const set = useCallback(async () => {
    if (total) {
      const nextProgress = getNextProgress(xRef.current, total)
      await client.playback.seekcur(nextProgress)
      setProgress(nextProgress)
    }
  }, [total, setProgress])

  const handleMouseMove = ({ clientX }: MouseEvent) => {
    if (barRef.current) {
      setMouseX(clientX)
      xRef.current = getX(barLeft, barWidth, clientX)
    }
    if (dragRef.current) {
      document.ondragstart = () => false
      setAnimationEnabled(false)
      if (total) {
        setProgress(getNextProgress(xRef.current, total), 'stop')
      }
      setX(xRef.current)
    }
  }

  const handleMouseUp = async () => {
    if (dragRef.current && barRef.current && total) {
      await set()
      dragRef.current = false
      setAnimationEnabled(true)
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
  }, [total, setProgress])

  useEffect(() => {
    if (!dragRef.current) {
      if (typeof total === 'number' && typeof progress === 'number') {
        setX(progress / total)
      } else {
        setX(0)
      }
    }
  }, [progress])

  useEffect(() => {
    dragRef.current = false
    setAnimationEnabled(true)
    if (typeof playInfo?.playing?.time?.elapsed === 'number') {
      setProgress(playInfo?.playing?.time?.elapsed)
    }
    document.ondragstart = () => true
  }, [playInfo?.playing?.songid])

  return (
    <div>
      <div
        className={styles.bar}
        ref={barRef}
        onMouseEnter={() => setTimeVisibility(true)}
        onMouseLeave={() => setTimeVisibility(false)}
        onMouseDown={async (e) => {
          e.preventDefault()
          e.stopPropagation()
          xRef.current = mouseXRatio
          setX(xRef.current)
          dragRef.current = true
        }}
      >
        <animated.span style={progressAnimationProps} />
        <div
          onMouseDown={() => {
            dragRef.current = true
          }}
          className={styles.knob}
          style={{
            left: percentage,
            transition: animationEnabled ? `all ${tension}ms` : 'none',
          }}
        />
        <span
          className={styles.time}
          style={{
            width: timeWidth,
            left: getTimeLeft(mouseXRatio, barWidth, barLeft),
            visibility:
              timeVisibility || !animationEnabled ? 'visible' : 'hidden',
          }}
        >
          {convertTime(getNextProgress(mouseXRatio, total ?? 0))}
        </span>
      </div>
    </div>
  )
}
