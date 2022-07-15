import type { Fetch, MpdApiResponse } from '@lib/request'

interface DBUpdateRes {
  updating_db: number
}

export class DB {
  private readonly fetch: InstanceType<typeof Fetch>

  constructor(fetch: InstanceType<typeof Fetch>) {
    this.fetch = fetch
  }

  async update(paths: string[] | string = ['']) {
    const results: MpdApiResponse<{
      updating_db: number
    }>[] = []
    if (typeof paths === 'string') {
      paths = [paths]
    }
    const promises = paths.reduce(
      async (promise: Promise<MpdApiResponse<DBUpdateRes> | void>, path) => {
        return promise.then(async () => {
          const res = await this.fetch.post<DBUpdateRes>('/db/update', [path])
          results.push(res)
          return new Promise((resolve) => resolve(res))
        })
      },
      Promise.resolve()
    )
    await promises
    return results.length > 1 ? results : results[0]
  }
}
