export type AnyObject = Record<string, unknown>

export interface RouteConfigItem extends AnyObject {
  path: string
  component?: React.ElementType
  title?: string
  routes?: RouteConfigItem[]
  redirect?: string
}
