import { Playback, DB, Playlists, Queue, Status } from '@lib/mpd-modules'
import { getFetch } from '@lib/helper'

interface MpdApiRetrundData<T> {
  data: T
}

interface MpdApiSuccess<T> extends MpdApiRetrundData<T> {
  code: 200
  message: 'OK'
}

interface MpdApiFailed<T> extends MpdApiRetrundData<T> {
  code: 500
  message: string
}

export type MpdApiResponse<T = any> = MpdApiFailed<T> | MpdApiSuccess<T>

export type FetchType = typeof Fetch

class Fetch {
  private readonly baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async post<T extends MpdApiResponse['data']>(
    url: string,
    args?: (string | number)[]
  ) {
    return getFetch<MpdApiResponse<T>>(this.baseUrl + url, {
      method: 'post',
      commandArgs: args,
    })
  }
}

export class Client {
  private readonly fetch
  public readonly playback
  public readonly db
  public readonly playlists
  public readonly queue
  public readonly status

  constructor(baseUrl: string) {
    if (/\d(\/+)$/g.test(baseUrl)) {
      baseUrl = baseUrl.replace(/(\/+)$/g, '')
    }
    this.fetch = new Fetch(baseUrl)
    this.playback = new Playback(this.fetch)
    this.db = new DB(this.fetch)
    this.playlists = new Playlists(this.fetch)
    this.queue = new Queue(this.fetch)
    this.status = new Status(this.fetch)
  }

  async test() {
    // const qq = await this.fetch.post('/jjjj')
  }
}
