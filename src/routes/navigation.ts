import type { RouteConfigItem } from '@routes'
import { Language } from '@i18n'
import produce from 'immer'

interface FlatRoutes {
  routes?: RouteConfigItem[]
  parentNodes?: { path: string }[]
  title: keyof typeof Language.en_US
  path: string
  level: number
}

const flattenRoutes = (
  children: any[],
  level = 1,
  parentNodes?: any[]
): Array<FlatRoutes> =>
  Array.prototype.concat.apply(
    children.map((x) => ({
      routes: x.routes,
      // ...x,
      title: x.title,
      path: x.path,
      level,
      parentNodes: JSON.parse(JSON.stringify(parentNodes || [])),
    })),
    children.map((x) =>
      flattenRoutes(
        x.routes || [],
        (level || 1) + 1,
        Array.isArray(parentNodes)
          ? [...parentNodes, { path: x.path }]
          : x.path !== undefined
          ? [{ path: x.path }]
          : []
      )
    )
  )

function replacePathWithDeepestFirstNode(
  items: FlatRoutes[],
  flat: FlatRoutes[]
) {
  const deepest = flat
    .sort((a, b) => b.level - a.level)
    .filter((s, _, self) => s.parentNodes?.length && s.level === self[0].level)
  for (const item of items) {
    if (item.routes) {
      item.path =
        deepest.find(({ parentNodes }) =>
          parentNodes?.find((p) => p.path === item.path)
        )?.path ?? item.path
    }
  }
}

let globalNav: FlatRoutes[] = []

export function getGlobalNav(routes: RouteConfigItem[]) {
  if (globalNav?.length) {
    return globalNav
  }
  const roots = routes.find(({ path }) => path === '/')
  const flat = produce<typeof flattenRoutes>(flattenRoutes)(
    roots!.routes!
  ).filter(
    (r, index, self) =>
      r.title && index === self.findIndex((t) => t.path === r.path)
  )
  const secondLevelItems = flat.filter((r) => r.level === 2)

  globalNav = produce<typeof replacePathWithDeepestFirstNode>(
    replacePathWithDeepestFirstNode
  )(secondLevelItems, flat)
  return globalNav
}

let libraryNav: FlatRoutes[] = []

export function getLibraryNav(routes: RouteConfigItem[]) {
  if (libraryNav?.length) {
    return libraryNav
  }
  const roots = routes.find(({ path }) => path === '/')
  const flat = produce<typeof flattenRoutes>(flattenRoutes)(
    roots!.routes!
  ).filter(
    (r, index, self) =>
      r.title &&
      r.parentNodes?.some(({ path }) => path === '/library') &&
      index === self.findIndex((t) => t.path === r.path)
  )

  libraryNav = produce<typeof replacePathWithDeepestFirstNode>(
    replacePathWithDeepestFirstNode
  )(flat, flat)
  return libraryNav
}
