import Component from './index'
import ListComponent from './List'
// import AddPluginComponent from './Add'

export default function (store) {
  return {
    component: Component,
    indexRoute: {
      navbar: 'list',
      component: ListComponent,
    },
    childRoutes: [{
      path: 'add',
      navbar: true,
      // component: AddPluginComponent,
    }, {
      path: '*',
      onEnter: (state, replace) => replace('/admin/plugins'),
    }],
  }
}
