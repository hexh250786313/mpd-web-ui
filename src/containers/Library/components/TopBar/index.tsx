import type { FC } from 'react'

import routes from '@routes/config'
import { getLibraryNav } from '@routes/navigation'
import { useI18n } from '@stores'
import { NavLink } from 'react-router-dom'

export const TopBar: FC = () => {
  const libraryNav = getLibraryNav(routes)
  const { translation } = useI18n()

  console.log('library nav')

  return (
    <div>
      <ul>
        {libraryNav.map((item) => {
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
