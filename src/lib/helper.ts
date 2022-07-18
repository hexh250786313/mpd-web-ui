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
    fnArgs: (string | number)[]
    method: string
  }>
) => Promise<R> = function (
  url: string,
  args = {
    fnArgs: [],
    method: 'get',
  }
) {
  const { method, fnArgs } = args
  const body = { fnArgs }
  const opts: FetchOptions<'json'> = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*',
    },
    credentials: 'include',
    mode: 'cors',
    cache: 'no-cache',
    body: JSON.stringify(body),
  }
  return $fetch(url, opts)
}
