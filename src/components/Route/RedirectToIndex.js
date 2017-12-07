import { Component } from 'react'
import { Redirect, formatPattern } from 'react-router'

export default class RedirectToIndex extends Component {
  static createRouteFromReactElement (element, parentRoute) {
    if (parentRoute) {
      const route = Redirect.createRouteFromReactElement(element)

      route.onEnter = function (nextState, replace) {
        const { location, params } = nextState
        const routeIndex = nextState.routes.indexOf(route)
        let parentPattern = Redirect.getRoutePattern(nextState.routes, routeIndex - 1)
        let pattern = parentPattern.replace(/\/*$/, '/')
        const pathname = formatPattern(pattern, params)
        replace({
          pathname,
          query: route.query || location.query,
          state: route.state || location.state
        })
      }
      return route
    } else {
      throw new Error('An <RedirectToIndex> does not make sense at the root of your route config')
    }
  }

  render () {
    throw new Error('<RedirectToIndex> elements are for router configuration only and should not be rendered')
  }
}
