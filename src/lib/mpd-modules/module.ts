import type { FetchType } from '@lib/request'

export class MpdModule {
  protected readonly fetch

  constructor(fetch: InstanceType<FetchType>) {
    this.fetch = fetch
  }
}
