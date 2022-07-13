import React, { Suspense } from 'react'
import routeConfig from './config'
import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from 'react-router-dom'
import { Page } from '@components'
import type { RouteConfigItem } from '@types'

/**
 * Generate the routes with "redirect". These routes will no be rendered but will be used to redirect
 *  */
const genRedirectRoutes: (routes: RouteConfigItem[]) => RouteConfigItem[] =
  function (routes) {
    return Array.prototype.concat
      .apply(
        routes.map((x) => ({
          path: x.path,
          redirect: x.redirect,
        })),
        routes.map((x) => genRedirectRoutes(x.routes || []))
      )
      .filter((t: RouteConfigItem) => t.redirect)
  }

/**
 * Render the routes
 *  */
const renderRoutes = (routes: RouteConfigItem[]) => {
  return routes.map((value) => {
    const { path, routes, component: Component, redirect } = value

    if (Array.isArray(routes) && routes.length !== 0) {
      return (
        <Route
          key={path}
          element={
            Component ? (
              <Component>
                <Outlet />
              </Component>
            ) : (
              <Outlet />
            )
          }
        >
          {renderRoutes(routes)}
        </Route>
      )
    }

    if (redirect) {
      return (
        <Route
          key={path}
          path={path}
          element={<Navigate replace to={redirect} />}
        />
      )
    }

    if (!Component) return null

    return <Route key={path} path={path} element={<Page {...value} />} />
  })
}

const redirectRoutes = genRedirectRoutes(routeConfig)

const RouteView = () => (
  <Router basename={'/'}>
    <Suspense>
      <Routes>
        {renderRoutes(routeConfig)}
        {renderRoutes(redirectRoutes)}
      </Routes>
    </Suspense>
  </Router>
)

export default RouteView
