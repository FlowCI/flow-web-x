import Component from './index'
import ListComponent from './List'
import CreateComponent from './Create'
export default function (store) {
  return {
    indexRoute: {
      onEnter: (nextState, replace) => replace('/admin/agents/list'),
    },
    component: Component,
    childRoutes: [{
      path: 'list',
      navbar: true,
      component: ListComponent,
    }, {
      path: 'create',
      navbar: true,
      component: CreateComponent,
    }],
  }
}
