import React from 'react'
import { Route } from 'react-router'

import Component from './index'

export const createRoutes = (path, store) => {
  return <Route path={path} component={Component} />
}

export default createRoutes
