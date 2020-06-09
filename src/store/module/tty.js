
import { send } from '../subscribe'

const state = {
  out: {}
}

const mutations = {
  setOut (state, out) {
    state.out = out
  }
}

const actions = {
  connect({commit}, jobId) {
    send(`/app/tty/${jobId}/open`, 'connect')
  }
}

export const Store = {
  namespaced: true,
  state,
  mutations,
  actions
}
