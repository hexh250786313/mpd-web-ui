import { MpdModule } from '@lib/mpd-modules/module'
import { ISong } from '@types'

export class Status extends MpdModule {
  async currentSong() {
    return this.fetch.post<ISong>('/status/currentsong')
  }
}
