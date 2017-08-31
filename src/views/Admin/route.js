import Component from './index'

import AgentsRoute from './Agents/route'
import s from './Credentials/route'
import FlowsRoute from './Flows/route'
import MembersRoute from './Members/route'
import NotifyRoute from './Notify/route'
import PluginsRoute from './Plugins/route'
import SystemRoute from './System/route'

export const createRoutes = (store) => ({
  component: Component,
  childRoutes: [{
    path: 'plugins',
    icon: 'icon-jigsaw',
    text: 'Plugin',
    navbar: true,
    ...PluginsRoute(store),
  }, {
    path: 'members',
    icon: 'icon-users',
    text: 'Member',
    navbar: true,
    ...MembersRoute(store),
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
    ...s(store),
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
