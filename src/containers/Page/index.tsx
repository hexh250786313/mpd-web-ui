import type { RouteConfigItem } from '@routes'
import type { FC } from 'react'

import { playInfoAtom, useI18n } from '@stores'
import { useMemo, useLayoutEffect } from 'react'
import { useAtomValue } from 'jotai'

function getState(state?: 'play' | 'stop' | 'pause') {
  switch (state) {
    case 'play': {
      return 'playing'
    }
    case 'pause': {
      return 'paused'
    }
    case 'stop': {
      return 'stopped'
    }
    default:
      return ''
  }
}

export const Page: FC<RouteConfigItem> = (props) => {
  const Component = props.component as React.ElementType
  const { translation } = useI18n()
  const t = useMemo(() => translation('Playing').t, [translation])
  const playInfo = useAtomValue(playInfoAtom)

  useLayoutEffect(() => {
    const title = playInfo?.current?.title
      ? `${playInfo?.current?.title} - ${
          playInfo?.current?.artist
            ? playInfo?.current?.artist.join(' & ')
            : t('unknown')
        }`
      : `${playInfo?.current?.file}`
    const status = t(getState(playInfo?.playing?.state)) ?? 'MPD'
    window.document.title = `${status}: ${title}`
  }, [playInfo])

  return (
    <div>
      <Component />
    </div>
  )
}
