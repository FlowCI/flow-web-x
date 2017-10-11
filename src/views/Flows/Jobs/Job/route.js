// import { injectReducer } from 'redux/reducers'

import Component from './index'
import JobInfo from './Info'
import JobLogs from './Logs'
import JobYml from './Yml'

export default function (store) {
  return {
    component: Component,
    indexRoute: {
      component: JobInfo,
    },
    childRoutes: [{
      path: 'logs',
      component: JobLogs,
    }, {
      path: 'yml',
      component: JobYml,
    }]
  }
}
