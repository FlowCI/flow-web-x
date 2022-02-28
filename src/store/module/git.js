import http from '../http'

const state = {
  items: [],
  loaded: {}
}

const mutations = {
  list(state, items) {
    state.items = items
  },

  add(state, git) {
    state.items.push(git)
  },
}

const actions = {
  async list({commit}) {
    await http.get(`gitconfig`, (items) => {
      commit('list', items)
    })
  },

  async save({commit}, payload) {
    await http.post(`gitconfig`, (item) => {
      commit('add', item)
    }, payload)
  }
}

export const Store = {
  namespaced: true,
  state,
  mutations,
  actions
}