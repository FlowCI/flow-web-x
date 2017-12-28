import React from 'react'
import { Route, IndexRedirect, Redirect } from 'react-router'

import Container from './index'
import YmlContainer from './YmlContainer'
import Build from './Build'
import Envs from './Envs'
import Yml from './Yml'
import Info from './Info'
import Editor from './Editor'
import Step from './Step'
import AddPlugin from './AddPlugin'

export default function (path, store) {
  return <Route path={path} component={Container}>
    <IndexRedirect to='editor' />
    <Route path='yml' component={YmlContainer}>
      <IndexRedirect to='edit' />
      <Route path='build' text='build' component={Build} navbar />
      <Route path='envs' text='envs' component={Envs} navbar />
      <Route path='edit' text='ymledit' component={Yml} navbar />
      <Route path='info' text='info' component={Info} navbar />
      <Redirect from='*' to='edit' />
    </Route>
    <Route path='editor' component={Editor}>
      <IndexRedirect to='build' />
      <Route component={YmlContainer}>
        <Route path='build' text='build' component={Build} navbar />
        <Route path='envs' text='envs' component={Envs} navbar />
        <Route path='edit' text='ymledit' component={Yml} navbar />
        <Route path='info' text='info' component={Info} navbar />
      </Route>
      <Route path='add/step' component={AddPlugin} />
      <Route path='add/afterStep' isAfterStep component={AddPlugin} />
      <Route path='step'>
        <Route path=':stepName' component={Step} />
      </Route>
      <Route path='afterStep' isAfterStep>
        <Route path=':stepName' component={Step} />
      </Route>
    </Route>
  </Route>
}
