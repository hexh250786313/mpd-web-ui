import type { FC, PropsWithChildren } from 'react'

import { PlayBar } from './components'

export const Playing: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      {children}
      <PlayBar />
    </div>
  )
}
