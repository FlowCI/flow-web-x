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

  async save({commit}, instance) {
    let empty = () => {};
    await http.post('system/settings', empty, instance)
  }
}

export const Store = {
  namespaced: true,
  state,
  mutations,
  actions
}
