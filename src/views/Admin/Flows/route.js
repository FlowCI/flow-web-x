import Component from './index'

export default function (store) {
  return {
    indexRoute: {
      onEnter: (nextState, replace) => replace('/admin/flows/list'),
    },
    component: Component,
    childRoutes: [{
      path: 'list',
      navbar: true,
    }, {
      path: 'members',
      navbar: true,
    }],
  }
}
