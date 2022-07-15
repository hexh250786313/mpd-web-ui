import { Fetch } from '@lib/request'

export class Playback {
  private readonly fetch: InstanceType<typeof Fetch>

  constructor(fetch: InstanceType<typeof Fetch>) {
    this.fetch = fetch
  }

  async play() {
    return this.fetch.post<'OK' | undefined>('/playback/play')
  }

  async pause() {
    return this.fetch.post<'OK' | undefined>('/playback/pause')
  }
}
