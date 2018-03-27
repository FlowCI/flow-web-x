import React from 'react'
import { Route, IndexRoute } from 'react-router'

import Component from './index'
import JobInfo from './Info'
import JobLogs from './Logs'
import JobYml from './Yml'
import JobArtifacts from './Artifacts'

export default function (path, store) {
  return <Route path={path} component={Component}>
    <IndexRoute component={JobInfo} />
    <Route path='logs' component={JobLogs} />
    <Route path='yml' component={JobYml} />
    <Route path='artifacts' component={JobArtifacts} />
  </Route>
}
