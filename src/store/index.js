import Vue from 'vue'
import Vuex from 'vuex'

import { Store as Global } from './module/global'
import { Store as AuthStore } from './module/auth'
import { Store as ErrorStore } from './module/error'
import { Store as FlowStore } from './module/flows'
import { Store as FlowItemStore } from './module/flow_items'
import { Store as FlowGroupStore } from './module/flow_groups'
import { Store as JobStore } from './module/jobs'
import { Store as StepStore } from './module/steps'
import { Store as LogStore } from './module/logs'
import { Store as AgentStore } from './module/agents'
import { Store as HostStore } from './module/hosts'
import { Store as SecretsStore } from './module/secrets'
import { Store as UserStore } from './module/users'
import { Store as StatsStore } from './module/stats'
import { Store as PluginStore } from './module/plugins'
import { Store as ConfigStore } from './module/configs'
import { Store as TtyStore } from './module/tty'
import { Store as SettingStore } from './module/settings'
import { Store as TriggerStore } from './module/triggers'
import { Store as GitStore } from './module/git'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    'g': Global,
    'auth': AuthStore,
    'err': ErrorStore,
    'flows': FlowStore,
    'flowItems': FlowItemStore,
    'flowGroups': FlowGroupStore,
    'jobs': JobStore,
    'steps': StepStore,
    'logs': LogStore,
    'agents': AgentStore,
    'hosts': HostStore,
    'secrets': SecretsStore,
    'users': UserStore,
    'stats': StatsStore,
    'plugins': PluginStore,
    'configs': ConfigStore,
    'tty': TtyStore,
    'settings': SettingStore,
    'triggers': TriggerStore,
    'git': GitStore
  }
})

export default store

export function errorCommit (code, message, data) {
  store.commit('err/set', {
    code,
    message,
    data
  })
}

export function newTokenCommit (newToken, refreshToken) {
  store.commit('auth/save', {token: newToken, refreshToken: refreshToken})
}
