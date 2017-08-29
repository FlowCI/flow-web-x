import Component from './index'

import AgentsRoute from './Agents/route'
import CredentialsRoute from './Credentials/route'
import FlowsRoute from './Flows/route'
import MemberRoute from './Member/route'
import NotifyRoute from './Notify/route'
import PluginRoute from './Plugin/route'
import SystemRoute from './System/route'

export const createRoutes = (store) => ({
  component: Component,
  childRoutes: [{
    path: 'plugin',
    icon: 'icon-jigsaw',
    text: 'Plugin',
    navbar: true,
    ...PluginRoute(store),
  }, {
    path: 'member',
    icon: 'icon-users',
    text: 'Member',
    navbar: true,
    ...MemberRoute(store),
  }, {
    path: 'agents',
    icon: 'icon-agents',
    text: 'Agent',
    navbar: true,
    ...AgentsRoute(store),
  }, {
    path: 'flows',
    icon: 'icon-branches',
    text: 'Flow',
    navbar: true,
    ...FlowsRoute(store),
  }, {
    path: 'credentials',
    icon: 'icon-bookmark',
    text: 'Credentials',
    navbar: true,
    ...CredentialsRoute(store),
  }, {
    path: 'system',
    icon: 'icon-warning',
    text: 'System',
    navbar: true,
    ...SystemRoute(store),
  }, {
    path: 'notify',
    icon: 'icon-notification',
    text: 'Notify',
    navbar: true,
    ...NotifyRoute(store),
  }]
})

export default createRoutes
