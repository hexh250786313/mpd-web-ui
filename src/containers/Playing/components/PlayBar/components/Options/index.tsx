import { useClient, useOptions } from '@stores'
import { IOptions } from '@types'
import { DOMAttributes, FC, MouseEventHandler, useEffect } from 'react'

function Button(params: {
  title: string
  enabled: boolean
  onClick: MouseEventHandler<HTMLDivElement> | undefined
}) {
  const { title, enabled, onClick } = params

  return (
    <div
      style={{
        color: enabled ? 'blue' : 'inherit',
      }}
      onClick={onClick}
    >
      {title}
    </div>
  )
}

export const Options: FC = () => {
  const { options, set: setOptions } = useOptions()
  const client = useClient()

  return (
    <div>
      {(['random', 'repeat', 'single', 'consume'] as Array<keyof IOptions>).map(
        (item) => (
          <Button
            key={item}
            title={item}
            enabled={options[item]}
            onClick={async () => {
              setOptions({ ...options, [item]: true })
              await client.playback.options(item, !options[item])
            }}
          />
        )
      )}
    </div>
  )
}
