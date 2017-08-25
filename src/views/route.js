// import React from 'react'
// import { Route, IndexRoute } from 'react-router'

import CoreLayout from 'layouts/CoreLayout'
import PageLayout from 'layouts/PageLayout'
import AdminLayout from 'layouts/AdminLayout'
import NeedSession from './needSession'

import Index from './IndexRoute'
// import Next from './Next'
import SignInRoute from './SignIn/route'
import FlowsRoute from './Flows/route'
import CreateRoute from './Create/route'

export default function (store) {
  return {
    path: '/',
    component: CoreLayout,
    childRoutes: [{
      component: PageLayout,
      childRoutes: [
        {
          ...SignInRoute(store),
          path: 'signin',
        }, {
          component: NeedSession,
          indexRoute: {
            component: Index
          },
          childRoutes: [
            {
              ...FlowsRoute(store),
              path: 'flows/:flowId',
            }, {
              ...CreateRoute(store),
              path: 'create'
            }
          ]
        }
      ]
    }, {
      path: 'admin',
      component: AdminLayout
    }]
  }
  // return <Route path='/' component={PageLayout}>
  //   <Route path='/signin' {...SignInRoute(store)} />
  //   <Route component={NeedSession}>
  //     <IndexRoute component={Index} />
  //     <Route path='/next' component={Next} />
  //   </Route>

  // </Route>
}
