import type { MpdApiResponse } from '@lib/request'
import type { Tag } from '@types'

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

  async about<T extends Tag>(tag: T) {
    return this.fetch.post<{ [k in T]: string }[]>('/db/about', [tag])
  }
}
