import Component from './index'
import ListComponent from './List'
import CreateComponent from './Create'

export default function (store) {
  return {
    component: Component,
    indexRoute: {
      navbar: 'list',
      component: ListComponent,
    },
    childRoutes: [{
      path: 'create',
      navbar: true,
      component: CreateComponent,
    }, {
      path: '*',
      onEnter: (state, replace) => replace('/admin/agents'),
    }],
  }
}
