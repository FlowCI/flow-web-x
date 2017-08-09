import React from 'react'
import { Route, IndexRoute } from 'react-router'

import PageLayout from 'layouts/PageLayout'
import NeedSession from './needSession'

import Home from './Home'
import Next from './Next'
import SignInRoute from './SignIn/route'

export default function (store) {
  return <Route path='/' component={PageLayout}>
    <IndexRoute component={Home} />
    <Route path='/signin' {...SignInRoute(store)} />
    <Route component={NeedSession}>
      <Route path='/next' component={Next} />
    </Route>
  </Route>
}
