import React from 'react'

import Component, { reducers } from './index'
import { injectReducer } from 'redux/reducers'

const NoopComponent = function () {
  return <div />
}

export const createRoutes = (store) => ({
  getComponent: function (state, callback) {
    injectReducer(store, reducers)
    callback(null, Component)
  },
  indexRoute: {
    step: 0,
    component: NoopComponent,
  },
  childRoutes: [{
    path: ':flowId',
    step: 1,
    component: NoopComponent,
  }]
})

export default createRoutes
