import Component from './index'
import ListComponent from './List'
import AddComponent from './Add'

export default function (store) {
  return {
    indexRoute: {
      onEnter: (nextState, replace) => replace('/admin/members/list'),
    },
    component: Component,
    childRoutes: [{
      path: 'list',
      navbar: true,
      component: ListComponent,
    }, {
      path: 'add',
      navbar: true,
      component: AddComponent,
    }],
  }
}
