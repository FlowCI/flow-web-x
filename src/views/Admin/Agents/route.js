import Component from './index'
import ListComponent from './List'
import CreateComponent from './Create'
export default function (store) {
  return {
    indexRoute: {
      navbar: 'list',
      component: ListComponent,
    },
    component: Component,
    childRoutes: [{
      path: 'create',
      navbar: 'create',
      component: CreateComponent,
    }, {
      path: '*',
      onEnter: (state, replace) => replace('/admin/agents'),
    }],
  }
}
