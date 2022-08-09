import type { IPlaying, ISong } from '@types'

import { MpdModule } from '@lib/mpd-modules/module'

export interface IStatus {
  queue: ISong[]
  current: ISong
  playing: IPlaying
}

export class Status extends MpdModule {
  async get() {
    return this.fetch.post<IStatus>('/mpd/web/status/get')
  }
}
