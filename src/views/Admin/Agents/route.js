import Component from './index'
import ListComponent from './List'
import CreateComponent from './Create'
import i18n from './i18n'

export default function (store) {
  return {
    indexRoute: {
      navbar: i18n('list.navbar'),
      title: i18n('list.title'),
      component: ListComponent,
    },
    component: Component,
    childRoutes: [{
      path: 'create',
      navbar: i18n('create.navbar'),
      title: i18n('create.title'),
      component: CreateComponent,
    }, {
      path: '*',
      onEnter: (state, replace) => replace('/admin/agents'),
    }],
  }
}
