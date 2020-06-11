import { send } from '../subscribe'

const state = {
  out: {},
  log: ''
}

const mutations = {
  setOut(state, out) {
    state.out = out
  },

  setLog(state, log) {
    state.log = log
  }
}

const actions = {
  connect({commit}, jobId) {
    send(`/app/tty/${jobId}/open`, 'connect')
  },

  shell({commit}, {jobId, script}) {
    send(`/app/tty/${jobId}/shell`, script)
  },

  close({commit}, jobId) {
    send(`/app/tty/${jobId}/close`, 'close')
  }
}

export const Store = {
  namespaced: true,
  state,
  mutations,
  actions
}
