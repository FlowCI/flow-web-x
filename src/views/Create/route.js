import React from 'react'

import Component from './index'

const NoopComponent = function () {
  return <div />
}

export const createRoutes = (store) => ({
  component: Component,
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
