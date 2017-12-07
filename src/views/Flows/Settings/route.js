import React from 'react'
import { Route, IndexRedirect } from 'react-router'

import Container from './index'
import Build from './Build'
import Envs from './Envs'
import Yml from './Yml'
import Info from './Info'

export default function (path, store) {
  return <Route path={path} component={Container}>
    <IndexRedirect to={`/flows/:flowId/${path}/build`} />
    <Route path='build'text='build' component={Build} navbar />
    <Route path='envs' text='envs' component={Envs} navbar />
    <Route path='yml' text='yml' component={Yml} navbar />
    <Route path='info' text='info' component={Info} navbar />
  </Route>
}
