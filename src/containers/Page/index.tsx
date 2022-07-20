import type { RouteConfigItem } from '@routes'
import { FC } from 'react'

import { useI18n } from '@stores'
import { useMemo, useLayoutEffect } from 'react'

export const Page: FC<RouteConfigItem> = (props) => {
  const { title } = props
  const Component = props.component as React.ElementType
  const { translation } = useI18n()
  const t = useMemo(() => translation(title).t, [translation, title])

  useLayoutEffect(() => {
    window.document.title = `${t('title') || title} - MPD`
  }, [t])

  return (
    <div>
      <Component />
    </div>
  )
}
