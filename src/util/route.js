import { createSelector } from 'reselect'
import { formatPattern } from 'react-router'

export function createNavbarSelector () {
  return createSelector(
    (route) => route,
    (route) => [route.indexRoute, ...route.childRoutes]
      .filter((r) => r && r.navbar)
  )
}

export function createActiveNavbarSelector () {
  return createSelector(
    (routes, route) => routes,
    (routes, route) => route,
    (routes, route) => {
      const index = routes.findIndex((r) => r === route)
      if (index > -1) {
        return routes[index + 1] // next route
      }
    }
  )
}

export function getRoutePattern (routes) {
  const paths = routes.filter((route) => route.path)
    .map((route) => route.path)
  const str = paths.join('/')
  return str.replace(/\/*$/, '/')
}

export function createBasePathSelector (includeCurrent) {
  return createSelector(
    ({ routes }) => routes,
    ({ route }) => route,
    ({ params }) => params,
    (routes, route, params) => {
      let index = routes.findIndex((r) => r === route)
      if (index > -1) {
        index = includeCurrent ? index + 1 : index
        return formatPattern(getRoutePattern(routes.slice(0, index)), params)
      }
      return ''
    }
  )
}
