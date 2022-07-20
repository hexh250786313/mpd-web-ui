import type { RouteConfigItem } from '@routes'

import { Test } from '@components'
import {
  Albums,
  Artists,
  Files,
  Genres,
  Library,
  Playlists,
  Queue,
  Search,
  Settings,
  Playing,
  BasicLayout,
} from '@containers'

const routes: RouteConfigItem[] = [
  // @todo: should delete it later
  {
    path: '/test',
    component: Test,
    title: 'Settings',
  },
  {
    path: '/',
    component: BasicLayout,
    redirect: '/queue',
    routes: [
      {
        path: '/playing',
        redirect: '/queue',
        component: Playing,
        routes: [
          {
            path: '/queue',
            component: Queue,
            title: 'Queue',
          },
          {
            path: '/playlists',
            component: Playlists,
            title: 'Playlists',
          },
          {
            path: '/library',
            component: Library,
            title: 'Library',
            routes: [
              {
                path: '/library/albums',
                component: Albums,
                title: 'Albums',
              },
              {
                path: '/library/albums',
                component: Albums,
                title: 'Albums',
              },
              {
                path: '/library/artists',
                component: Artists,
                title: 'Artists',
              },
              {
                path: '/library/genres',
                component: Genres,
                title: 'Genres',
              },
              {
                path: '/library/files',
                component: Files,
                title: 'Files',
              },
              {
                path: '/library/search',
                component: Search,
                title: 'Search',
              },
            ],
          },
        ],
      },
      {
        path: '/settings',
        component: Settings,
        title: 'Settings',
      },
    ],
  },
]

export default routes
