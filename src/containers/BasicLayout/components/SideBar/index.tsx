import type { FC } from 'react'

import { Language } from '@i18n'
import routes from '@routes/config'
import { useI18n } from '@stores'
import { NavLink } from 'react-router-dom'

interface FlatRoutes {
  title: keyof typeof Language.en_US
  path: string
  level: number
}

const flatten = (children: any[], level = 1): Array<FlatRoutes> =>
  Array.prototype.concat.apply(
    children.map((x) => ({
      // ...x,
      title: x.title,
      path: x.path,
      level,
    })),
    children.map((x) => flatten(x.routes || [], (level || 1) + 1))
  )

export const SideBar: FC = () => {
  const roots = routes.find(({ path }) => path === '/')
  const flat = flatten(roots!.routes!).filter((r) => r.title)
  const secondLevelItems = flat.filter((r) => r.level === 2)
  const firstLevelItems = flat.filter((r) => r.level === 1)
  const sideItems: FlatRoutes[] = Array.prototype.concat(
    secondLevelItems,
    firstLevelItems
  )
  const { translation } = useI18n()

  console.log(sideItems)

  return (
    <div>
      <ul>
        {sideItems.map((item) => {
          return (
            <li key={item.title}>
              <NavLink to={item.path}>
                {translation(item.title).t('title')}
              </NavLink>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
