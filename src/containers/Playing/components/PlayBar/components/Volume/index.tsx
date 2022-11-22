import { FC } from 'react'

import { useEffect, useRef, useState } from 'react'
import { useClient, useVolume } from '@stores'
import styles from '../ProgressBar/index.module.scss'
import { animated, useSpring } from 'react-spring'
import { getX, tension } from '../ProgressBar/helpers'
import { getNextVol } from './helpers'

export const Volume: FC = () => {
  const client = useClient()
  const { volume } = useVolume()
  const [x, setX] = useState(volume)
  const [mouseX, setMouseX] = useState<number>(0)
  const [animationEnabled, setAnimationEnabled] = useState(true)
  const percentage = (x ?? 0) + '%'

  const barRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<boolean>(false)
  const xRef = useRef<number>(0)
  const barWidth = barRef.current
    ? barRef.current.getBoundingClientRect().width
    : 0
  const barLeft = barRef.current
    ? barRef.current.getBoundingClientRect().left
    : 0

  const mouseXRatio = barRef.current ? getX(barLeft, barWidth, mouseX) * 100 : 0

  const changeVolume = (nextVolume?: number) => {
    async function change() {
      if (typeof nextVolume === 'number') {
        await client.playback.setvol(nextVolume)
      }
    }

    change()
  }

  const progressAnimationProps = useSpring({
    width: percentage,
    config: {
      tension,
      friction: 20,
    },
  })

  useEffect(() => {
    if (typeof volume === 'number' && !dragRef.current) {
      setX(volume)
    }
  }, [volume])

  const handleMouseMove = ({ clientX }: MouseEvent) => {
    if (barRef.current) {
      setMouseX(clientX)
      xRef.current = getX(barLeft, barWidth, clientX) * 100
    }
    if (dragRef.current) {
      document.ondragstart = () => false
      setAnimationEnabled(false)
      setX(xRef.current)
      // too many requests
      // throttleIt(() => changeVolume(xRef.current))
    }
  }

  const handleMouseUp = () => {
    if (dragRef.current && barRef.current) {
      dragRef.current = false
      changeVolume(getNextVol(xRef.current))
      setAnimationEnabled(true)
      document.ondragstart = () => true
    }
  }

  useEffect(() => {
    const mode = import.meta.env.MODE
    if (mode === 'development') {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [volume, dragRef.current, barRef.current, xRef.current])

  return (
    <div>
      {typeof volume === 'number' ? (
        <div
          ref={barRef}
          className={styles.bar}
          style={{ width: 50 }}
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
            className={styles.knob}
            style={{
              left: percentage,
              transition: animationEnabled ? `all ${tension}ms` : 'none',
            }}
          />
        </div>
      ) : (
        'no output'
      )}
    </div>
  )
}
