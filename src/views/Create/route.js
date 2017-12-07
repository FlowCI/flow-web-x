import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'

import Component from './index'

export default function (path, store) {
  return <Route path={path} component={Component}>
    <IndexRoute step={0} />
    <Route path=':flowId' step={1}>
      <Route path='yml' step={2} />
      <Redirect from='*' to='/create/:flowId' />
    </Route>
  </Route>
}
