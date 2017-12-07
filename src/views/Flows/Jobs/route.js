import React from 'react'
import { Route } from 'react-router'

import Component from './index'

import JobRoute from './Job/route'

export default function (path, store) {
  return <Route path={path} component={Component}>
    {JobRoute(':jobNumber', store)}
  </Route>
}
