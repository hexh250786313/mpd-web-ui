import type { MpdApiResponse } from '@lib/request'

import { genPromiseQueue } from '@lib/helper'
import { MpdModule } from '@lib/mpd-modules/module'

interface DBUpdateRes {
  updating_db: number
}

export class DB extends MpdModule {
  async update(paths: string[] | string = ['']) {
    if (typeof paths === 'string') {
      paths = [paths]
    }
    const results = await genPromiseQueue<MpdApiResponse<DBUpdateRes>, string>(
      paths,
      async (S: string) => await this.fetch.post<DBUpdateRes>('/db/update', [S])
    )
    return results.length > 1 ? results : results[0]
  }
}
