import { injectReducer } from 'redux/reducers'

import Component, { reducers } from './index'
import IndexRouteComponent from './IndexRoute'

import JobsRoute from './Jobs/route'

export default function (store) {
  const jobsRoute = JobsRoute(store)
  return {
    getComponent: function (state, callback) {
      injectReducer(store, reducers)
      callback(null, Component)
    },
    indexRoute: {
      component: IndexRouteComponent,
    },
    childRoutes: [{
      ...jobsRoute,
      path: 'jobs',
    }]
  }
}
