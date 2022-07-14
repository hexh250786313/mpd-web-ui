import type { RouteConfigItem } from '@routes'

import { Test, BasicLayout } from '@components'
import { Queue } from '@containers'

const routes: RouteConfigItem[] = [
  {
    path: '/',
    component: BasicLayout,
    redirect: '/queue',
    routes: [
      {
        path: '/queue',
        component: Queue,
        title: 'Queue',
      },
      {
        path: '/playlists',
        component: Test,
        title: 'Playlists',
      },
      {
        path: '/library',
        component: Test,
        routes: [
          {
            path: '/library',
            component: Test,
          },
          {
            path: '/library/artists',
            component: Test,
            title: 'Artists',
          },
          {
            path: '/library/albums',
            component: Test,
            title: 'Albums',
          },
          {
            path: '/library/genres',
            component: Test,
            title: 'Genres',
          },
          {
            path: '/library/files',
            component: Test,
            title: 'Files',
          },
          {
            path: '/library/search',
            component: Test,
            title: 'Search',
          },
        ],
      },
      {
        path: '/settings',
        component: Test,
        title: 'Settings',
      },
    ],
  },
]

export default routes
