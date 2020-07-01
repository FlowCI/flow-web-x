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
  list({commit}) {
    http.get('configs', (list) => {
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

  async saveAndroidSign({commit}, {name, payload}) {

    let jsonOptionData = JSON.stringify({
      keyStorePassword: payload.keyStorePassword,
      keyAlias: payload.keyAlias,
      keyPassword: payload.keyPassword
    })

    let formData = new FormData()
    formData.append("keyStore", payload.keyStore)
    formData.append("option", new Blob([jsonOptionData], {type: "application/json"}))

    await http.post(
      `configs/${name}/android/sign`,
      (c) => {
        commit('add', c)
      },
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        },
      })
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
