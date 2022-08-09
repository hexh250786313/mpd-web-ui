import type { FetchOptions } from 'ohmyfetch'

import { $fetch } from 'ohmyfetch'

/**
 * Generate a promise queue
 *  */
export async function genPromiseQueue<T, P = any>(
  pending: P[],
  cb: (args: P) => Promise<T>
) {
  const results: T[] = []
  await pending.reduce(async (promise: Promise<T | void>, current) => {
    return promise.then(async () => {
      const res = await cb(current)
      results.push(res)
      return new Promise((resolve) => resolve(res))
    })
  }, Promise.resolve())
  return results
}

/**
 * Generate fetch
 *  */
export const getFetch: <R extends Record<keyof R, unknown>>(
  url: string,
  args: Partial<{
    commandArgs: (string | number)[]
    method: string
  }>
) => Promise<R> = function (
  url: string,
  args = {
    commandArgs: [],
    method: 'get',
  }
) {
  let errorData: any = null
  const { method, commandArgs } = args
  const body = { commandArgs }
  const opts: FetchOptions<'json'> = {
    method,
    body,
    onResponseError: async ({ response }) => {
      errorData = response._data
    },
  }
  return $fetch(url, opts).catch(() => errorData)
}

/**
 * Convert second to minute
 *  */
export function convertTime(time?: number) {
  if (time === undefined) {
    return '--'
  }
  const minute = Math.floor(time / 60)
  const second = Math.floor(time % 60)
  return `${minute}:${second < 10 ? '0' : ''}${second}`
}
