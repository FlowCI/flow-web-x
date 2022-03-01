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

  delete(state, source) {
    for (let i = 0; i < state.items.length; i++) {
      if (state.items[i].source === source) {
        state.items.splice(i, 1)
        return
      }
    }
  }
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
  },

  async delete({commit}, source) {
    await http.delete(`gitconfig/${source}`, () => {
      commit('delete', source)
    })
  }
}

export const Store = {
  namespaced: true,
  state,
  mutations,
  actions
}