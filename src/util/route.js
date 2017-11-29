import { createSelector } from 'reselect'

export function createNavbarSelector () {
  return createSelector(
    ({ route }) => [route.indexRoute, ...route.childRoutes],
    (routes) => routes.filter((route) => route && route.navbar)
  )
}

export function createActiveNavbarSelector () {
  return createSelector(
    ({ routes, route }) => routes,
    ({ routes, route }) => route,
    (routes, route) => {
      const index = routes.findIndex((r) => r === route)
      if (index > -1) {
        return routes[index + 1] // next route
      }
    }
  )
}
