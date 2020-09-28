import http from '../http'

const state = {
  instance: {}
}

const mutations = {
  set(state, settings) {
    state.instance = settings
  },
}

const actions = {
  async get({commit}) {
    await http.get('system/settings', (o) => {
      commit('set', o)
    })
  },
}

export const Store = {
  namespaced: true,
  state,
  mutations,
  actions
}
