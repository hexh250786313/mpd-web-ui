import type { FetchOptions } from 'ohmyfetch'

import { $fetch } from 'ohmyfetch'

interface ResponseSuccess<T> {
  code: 200
  message: 'OK'
  data: T
}

interface ResponseError<T> {
  code: 500
  message: string
  data?: T
}

type Response<T = any> = ResponseError<T> | ResponseSuccess<T>

/**
 * Generate fetch options combined with body
 *  */
const getFetch: <T extends Response['data']>(
  url: string,
  args: Partial<{
    fnArgs: string[]
    method: string
  }>
) => Promise<Response<T>> = function (
  url: string,
  args = {
    fnArgs: [],
    method: 'get',
  }
) {
  const { method, fnArgs } = args
  const body = { fnArgs }
  const opts: FetchOptions<'json'> = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*',
    },
    credentials: 'include',
    mode: 'cors',
    cache: 'no-cache',
    body: JSON.stringify(body),
  }
  return $fetch<Response>(url, opts)
}

class Fetch {
  private readonly baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async post<T>(url: string, args?: string[]) {
    return getFetch<T>(this.baseUrl + url, { method: 'post', fnArgs: args })
  }
}

export class Client {
  private readonly fetch: InstanceType<typeof Fetch>

  constructor(baseUrl: string) {
    if (/\d(\/+)$/g.test(baseUrl)) {
      baseUrl = baseUrl.replace(/(\/+)$/g, '')
    }
    this.fetch = new Fetch(baseUrl)
  }

  async playbackPlay() {
    return this.fetch.post<'OK' | undefined>('/playback/play')
  }

  async playbackPause() {
    return this.fetch.post<'OK' | undefined>('/playback/pause')
  }

  async test() {
    const qq = await this.playbackPlay()
    if (qq.code === 500) {
      if (qq.message === 'jj') {
        //
      }
    }
  }
}
