import http from '../http'

const state = {
  items: [],
  loaded: {}
}

const mutations = {
  add(state, config) {
    state.items.push(config)
  },

  remove(state, config) {
    for (let i = 0; i < state.items.length; i++) {
      if (state.items[i].id === config.id) {
        state.items.splice(i, 1)
        return
      }
    }
  },

  list(state, configs) {
    state.items = configs
  },

  loaded(state, config) {
    state.loaded = config
  }
}

const actions = {
  async list({commit}) {
    await http.get('configs', (list) => {
      commit('list', list)
    })
  },

  async listSmtp({commit}) {
    await http.get('configs?category=SMTP', (list) => {
      commit('list', list)
    })
  },

  async saveSmtp({commit}, {name, payload}) {
    await http.post(`configs/${name}/smtp`, (c) => {
      commit('add', c)
    }, payload)
  },

  async saveText({commit}, {name, payload}) {
    await http.post(`configs/${name}/text`, (c) => {
      commit('add', c)
    }, {data: payload.text})
  },

  async delete({commit}, name) {
    await http.delete(`configs/${name}`, (c) => {
      commit('remove', c)
    })
  },

  get({commit}, name) {
    http.get(`configs/${name}`, (c) => {
      commit('loaded', c)
    })
  }
}

export const Store = {
  namespaced: true,
  state,
  mutations,
  actions
}
