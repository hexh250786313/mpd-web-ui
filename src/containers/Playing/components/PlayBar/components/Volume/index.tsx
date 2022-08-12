import type { FC } from 'react'

import { useVolume } from '@stores'

export const Volume: FC = () => {
  const { volume } = useVolume()

  return <div>{volume ?? 'no output'}</div>
}
