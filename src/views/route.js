import React from 'react'
import { Route, IndexRoute } from 'react-router'

import CoreLayout from 'layouts/CoreLayout'
import PageLayout from 'layouts/PageLayout'
import AdminLayout from 'layouts/AdminLayout'
import NeedSession from './needSession'

import Index from './IndexRoute'
// import Next from './Next'
import SignInRoute from './SignIn/route'
import FlowsRoute from './Flows/route'
import CreateRoute from './Create/route'
import AdminRoute from './Admin/route'

export default function (store) {
  return <Route path='/' component={CoreLayout}>
    <Route component={PageLayout}>
      {SignInRoute('signin', store)}
    </Route>
    <Route component={NeedSession}>
      <Route component={PageLayout}>
        <IndexRoute component={Index} />
        {FlowsRoute('flows/:flowId', store)}
        {CreateRoute('create', store)}
      </Route>
      <Route component={AdminLayout}>
        {AdminRoute('admin', store)}
      </Route>
    </Route>
  </Route>
}
