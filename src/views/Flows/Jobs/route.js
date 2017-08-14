// import { injectReducer } from 'redux/reducers'

import Component from './index'

import JobRoute from './Job/route'

export default function (store) {
  return {
    component: Component,
    childRoutes: [{
      ...JobRoute(store),
      path: ':jobId'
    }]
  }
}
