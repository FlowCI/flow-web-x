import Component from './index'
import ListComponent from './List'
import CeateComponent from './Create'

export default function (store) {
  return {
    component: Component,
    indexRoute: {
      onEnter: (nextState, replace) => replace('/admin/credentials/list'),
    },
    childRoutes: [{
      path: 'list',
      navbar: true,
      component: ListComponent,
    }, {
      path: 'create',
      navbar: true,
      component: CeateComponent,
    }]
  }
}
