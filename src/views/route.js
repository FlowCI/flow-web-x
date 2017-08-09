import React from 'react'
import { Route, IndexRoute } from 'react-router'

import PageLayout from 'layouts/PageLayout'
import NeedSession from './needSession'

import Index from './IndexRoute'
import Next from './Next'
import SignInRoute from './SignIn/route'

export default function (store) {
  return <Route path='/' component={PageLayout}>
    <Route path='/signin' {...SignInRoute(store)} />
    <Route component={NeedSession}>
      <IndexRoute component={Index} />
      <Route path='/next' component={Next} />
    </Route>
  </Route>
}
