// import React from 'react'
// import { Route, IndexRoute } from 'react-router'

import PageLayout from 'layouts/PageLayout'
import NeedSession from './needSession'

import Index from './IndexRoute'
// import Next from './Next'
import SignInRoute from './SignIn/route'
import FlowsRoute from './Flows/route'

export default function (store) {
  return {
    path: '/',
    component: PageLayout,
    childRoutes: [{
      ...SignInRoute(store),
      path: 'signin',
    }, {
      component: NeedSession,
      indexRoute: {
        component: Index
      },
      childRoutes: [{
        ...FlowsRoute(store),
        path: 'flows/:flowId',
      }]
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
