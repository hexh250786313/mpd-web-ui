import type { FetchOptions } from 'ohmyfetch'

import { $fetch } from 'ohmyfetch'
import { Playback, DB } from '@lib/handlers'

interface MpdApiRetrundSuccess<T> {
  code: 200
  message: 'OK'
  data: T
}

interface MpdApiRetrundFailed<T> {
  code: 500
  message: string
  data?: T
}

export type MpdApiResponse<T = any> =
  | MpdApiRetrundFailed<T>
  | MpdApiRetrundSuccess<T>

/**
 * Generate fetch options combined with body
 *  */
const getFetch: <T extends MpdApiResponse['data']>(
  url: string,
  args: Partial<{
    fnArgs: string[]
    method: string
  }>
) => Promise<MpdApiResponse<T>> = function (
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
  return $fetch<MpdApiResponse>(url, opts)
}

export class Fetch {
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
  public readonly playback: Playback
  public readonly db: DB

  constructor(baseUrl: string) {
    if (/\d(\/+)$/g.test(baseUrl)) {
      baseUrl = baseUrl.replace(/(\/+)$/g, '')
    }
    this.fetch = new Fetch(baseUrl)
    this.playback = new Playback(this.fetch)
    this.db = new DB(this.fetch)
  }

  async test() {
    // const qq = await this.fetch.post('/jjjj')
  }
}
