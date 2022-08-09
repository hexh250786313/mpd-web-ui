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
}
