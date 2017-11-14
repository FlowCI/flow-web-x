import Component from './index'
import ListComponent from './List'
import MembersComponent from './Members'

export default function (store) {
  return {
    indexRoute: {
      onEnter: (nextState, replace) => replace('/admin/flows/list'),
    },
    component: Component,
    childRoutes: [{
      path: 'list',
      navbar: true,
      component: ListComponent,
    }, {
      path: 'members',
      navbar: true,
      component: MembersComponent,
    }],
  }
}
