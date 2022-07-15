import type { RouteConfigItem } from '@routes'

import { BasicLayout, Test } from '@components'
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
        // component: BasicLayout,
        routes: [
          {
            path: '/library',
            component: Library,
            title: 'Library',
          },
          {
            path: '/library/artists',
            component: Artists,
            title: 'Artists',
          },
          {
            path: '/library/albums',
            component: Albums,
            title: 'Albums',
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
      {
        path: '/settings',
        component: Settings,
        title: 'Settings',
      },
    ],
  },
]

export default routes
