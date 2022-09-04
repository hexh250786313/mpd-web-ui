import type { IOptions } from '@types'

import { MpdModule } from '@lib/mpd-modules/module'

type NoData = 'OK' | undefined

export class Playback extends MpdModule {
  async play(songIndex?: number) {
    return this.fetch.post<NoData>(
      '/mpd/native/playback/play',
      typeof songIndex !== 'undefined' ? [songIndex] : undefined
    )
  }

  async pause() {
    return this.fetch.post<NoData>('/mpd/native/playback/pause')
  }

  async next() {
    return this.fetch.post<NoData>('/mpd/native/playback/next')
  }

  async prev() {
    return this.fetch.post<NoData>('/mpd/native/playback/prev')
  }

  async stop() {
    return this.fetch.post<NoData>('/mpd/native/playback/stop')
  }

  async toggle() {
    return this.fetch.post<NoData>('/mpd/native/playback/toggle')
  }

  async seekcur(time: number) {
    return this.fetch.post<NoData>('/mpd/native/playback/seekcur', [time])
  }

  async setvol(volume: number) {
    return this.fetch.post<NoData>('/mpd/native/playback/setvol', [volume])
  }

  async options(option: keyof IOptions, state: boolean) {
    return this.fetch.post<NoData>(`/mpd/native/playback/${option}`, [
      state ? 1 : 0,
    ])
  }
}
