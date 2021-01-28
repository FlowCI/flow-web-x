import { send } from '../subscribe'

const state = {
}

const mutations = {
}

const actions = {
  connect({commit}, {jobId, nodePath}) {
    send(`/app/tty/${jobId}/${btoa(nodePath)}/open`, 'connect')
  },

  shell({commit}, {jobId, nodePath, script}) {
    send(`/app/tty/${jobId}/${btoa(nodePath)}/shell`, script)
  },

  close({commit}, {jobId, nodePath}) {
    send(`/app/tty/${jobId}/${btoa(nodePath)}/close`, 'close')
  }
}

export const Store = {
  namespaced: true,
  state,
  mutations,
  actions
}
