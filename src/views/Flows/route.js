import { injectReducer } from 'redux/reducers'

import Component, { reducers } from './index'
import IndexRouteComponent from './IndexRoute'

import JobsRoute from './Jobs/route'
import SettingRoute from './Settings/route'

export default function (store) {
  return {
    getComponent: function (state, callback) {
      injectReducer(store, reducers)
      callback(null, Component)
    },
    indexRoute: {
      component: IndexRouteComponent,
    },
    childRoutes: [{
      ...JobsRoute(store),
      path: 'jobs',
    }, {
      ...SettingRoute(store),
      path: 'settings'
    }]
  }
}
