import React from 'react'
import { Route, IndexRoute } from 'react-router'

import Component from './index'
import IndexRouteComponent from './IndexRoute'

import JobsRoute from './Jobs/route'
import SettingRoute from './Settings/route'

export default function (path, store) {
  return <Route path={path} component={Component}>
    <IndexRoute component={IndexRouteComponent} />
    {JobsRoute('jobs', store)}
    {SettingRoute('settings', store)}
  </Route>
}
