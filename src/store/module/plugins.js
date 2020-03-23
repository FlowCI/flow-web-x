import http from '../http'

const state = {
  items: [],
  readme: {},
  icon: {},
  tags:[], // tag set
}

const mutations = {
  setItems (state, items) {
    let tags = new Set()
    for (let item of items) {
      for (let tag of item.tags) {
        tags.add(tag)
      }
    }

    state.items = items
    state.tags = [...tags]
  },

  setReadMe (state, {name, content}) {
    state.readme[name] = content
  },

  setIcon (state, {name, contentInBase64}) {
    state.icon[name] = contentInBase64
  }
}

const actions = {
  async list({commit}) {
    await http.get('plugins', (plugins) => {
      commit('setItems', plugins)
    })
  },

  async readme({commit}, name) {
    await http.get(`plugins/${name}/readme`, (contentInBase64) => {
      let content = atob(contentInBase64)
      commit('setReadMe', {name, content})
    })
  },

  async icon({commit}, name) {
    await http.get(`plugins/${name}/icon`, (contentInBase64) => {
      commit('setIcon', {name, contentInBase64})
    })
  }
}

export const Store = {
  namespaced: true,
  state,
  mutations,
  actions
}
