import { MpdModule } from '@lib/mpd-modules/module'
import { ISong } from '@types'

export class Queue extends MpdModule {
  async info() {
    // return this.fetch.post<ISong[]>('/queue/info')
    return this.fetch.post<ISong[]>('/mpd/native/queue/info')
  }
}
