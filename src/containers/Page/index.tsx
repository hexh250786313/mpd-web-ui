import type { RouteConfigItem } from '@routes'

import { useI18n } from '@stores'
import React, { useEffect, useMemo } from 'react'

export const Page: React.FC<RouteConfigItem> = (props) => {
  const { title } = props
  const Component = props.component as React.ElementType
  const { translation } = useI18n()
  const t = useMemo(() => translation(title).t, [translation, title])

  useEffect(() => {
    window.document.title = `${t('title') || title} - MPD`
  }, [t])

  return (
    <div>
      <Component />
    </div>
  )
}
