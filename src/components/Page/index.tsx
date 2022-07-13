import React, { useEffect } from 'react'
import type { RouteConfigItem } from '@types'

export const Page: React.FC<RouteConfigItem> = (props) => {
  const { title } = props
  const Component = props.component as React.ElementType

  useEffect(() => {
    window.document.title = title || ''
  }, [title])

  return <Component />
}
