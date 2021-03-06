import type { FC } from 'react'

import { useI18n } from '@stores'
import { NavLink } from 'react-router-dom'
import { getGlobalNav } from '@routes/navigation'
import routes from '@routes/config'

export const SideBar: FC = () => {
  const { translation } = useI18n()
  const globalNav = getGlobalNav(routes)

  console.log('global nav')

  return (
    <div>
      <ul>
        {globalNav.map((item) => {
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
