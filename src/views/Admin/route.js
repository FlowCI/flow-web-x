import Component from './index'

import AgentRoute from './Agent/route'
import CredentialsRoute from './Credentials/route'
import FlowRoute from './Flow/route'
import MemberRoute from './Member/route'
import NotifyRoute from './Notify/route'
import PluginRoute from './Plugin/route'
import SystemRoute from './System/route'

export const createRoutes = (store) => ({
  component: Component,
  childRoutes: [{
    path: 'plugin',
    ...PluginRoute(store),
  }, {
    path: 'member',
    ...MemberRoute(store),
  }, {
    path: 'agent',
    ...AgentRoute(store),
  }, {
    path: 'flow',
    ...FlowRoute(store),
  }, {
    path: 'credentials',
    ...CredentialsRoute(store),
  }, {
    path: 'system',
    ...SystemRoute(store),
  }, {
    path: 'notify',
    ...NotifyRoute(store),
  }]
})

export default createRoutes
