import React from 'react'
import { Route } from 'react-router'

import Component from './index'

export default function (path, store) {
  return <Route path={path} component={Component}
    icon='icon-warning' text='System' navbar />
}
