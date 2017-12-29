import React from 'react'
import { Route, IndexRoute } from 'react-router'
import { RedirectToIndex } from 'components/Route'

import Component from './index'
import ListComponent from './List'
import AddPluginComponent from './Add'

export default function (path, store) {
  return <Route path={path} icon='icon-jigsaw' text='Plugin'
    navbar component={Component}>
    <IndexRoute navbar='list' component={ListComponent} />
    <Route path='add' navbar component={AddPluginComponent} />
    <RedirectToIndex from='*' />
  </Route>
}
