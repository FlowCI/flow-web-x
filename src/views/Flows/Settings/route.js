import React from 'react'
import { Route, IndexRedirect, Redirect } from 'react-router'

import Container from './index'
import YmlContainer from './YmlContainer'
import Build from './Build'
import Envs from './Envs'
import Yml from './Yml'
import Info from './Info'

export default function (path, store) {
  return <Route path={path} component={Container}>
    <IndexRedirect to='yml' />
    <Route path='yml' component={YmlContainer}>
      <IndexRedirect to='edit' />
      <Route path='build' text='build' component={Build} navbar />
      <Route path='envs' text='envs' component={Envs} navbar />
      <Route path='edit' text='ymledit' component={Yml} navbar />
      <Route path='info' text='info' component={Info} navbar />
      <Redirect from='*' to='edit' />
    </Route>
  </Route>
}
