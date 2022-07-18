import { Client } from '@lib/request'
import { atom, useAtom } from 'jotai'

const clientAtom = atom({
  key: '',
  instance: null as Client | null,
})

export function useAPIInfo() {
  const qs = new URLSearchParams(location.search)

  let url: URL | undefined
  {
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="external-controller"]'
    )
    if (meta?.content?.match(/^https?:/) != null) {
      // [protocol]://[secret]@[hostname]:[port]
      url = new URL(meta.content)
    }
  }

  const hostname =
    qs.get('host') ??
    localStorage?.[0]?.hostname ??
    url?.hostname ??
    '127.0.0.1'

  const port = qs.get('port') ?? localStorage?.[0]?.port ?? url?.port ?? '8080'

  const protocol =
    qs.get('protocol') ?? hostname === '127.0.0.1'
      ? 'http:'
      : url?.protocol ?? window.location.protocol

  return { hostname, port, protocol }
}

export function useClient() {
  const { hostname, port, protocol } = useAPIInfo()

  const [item, setItem] = useAtom(clientAtom)

  const key = `${protocol}//${hostname}:${port}`

  if (item.key === key) {
    return item.instance!
  }

  const client = new Client(key)
  setItem({ key, instance: client })

  return client
}
