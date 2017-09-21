// import { injectReducer } from 'redux/reducers'

import Component from './index'
import JobInfo from './Info'
import JobLogs from './Logs'

export default function (store) {
  return {
    component: Component,
    indexRoute: {
      component: JobInfo,
    },
    childRoutes: [{
      path: 'logs',
      component: JobLogs,
    }]
  }
}
