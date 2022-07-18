import { MpdModule } from '@lib/mpd-modules/module'

export class Playlists extends MpdModule {
  async list() {
    return this.fetch.post<any>('/playlists/list')
  }
}
