import { Login, Test } from '@components'
import { BasicLayout } from '@containers/BasicLayout'
import { RouteConfigItem } from '@types'

const routes: RouteConfigItem[] = [
  {
    path: '/',
    redirect: '/library',
  },
  {
    path: '/library',
    component: BasicLayout,
    redirect: '/library/album',
    routes: [
      {
        path: '/library/album',
        redirect: '/library/album/test',
        routes: [
          {
            path: '/library/album/test',
            component: Test,
            title: 'test',
          },
        ],
      },
    ],
  },
  {
    path: 'settings',
    component: Login,
    title: 'settings',
  },
]

export default routes
