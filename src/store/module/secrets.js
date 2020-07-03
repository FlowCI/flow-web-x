import http from '../http'

const state = {
  items: [],
  loaded: {
    name: '',
    privateKey: '',
    publicKey: ''
  }
}

const mutations = {
  add (state, secrets) {
    state.items.push(secrets)
  },

  remove (state, secrets) {
    for (let i = 0; i < state.items.length; i++) {
      if (state.items[i].id === secrets.id) {
        state.items.splice(i, 1)
        return
      }
    }
  },

  list (state, secrets) {
    state.items = secrets
  },

  loaded (state, credential) {
    state.loaded = credential
  }
}

const actions = {
  list ({commit}) {
    http.get('secrets', (c) => {
      commit('list', c)
    })
  },

  listNameOnly ({commit}, category) {
    http.get('secrets/list/name', (c) => {
      commit('list', c)
    }, {category})
  },

  async createRsa ({commit}, {name, publicKey, privateKey}) {
    await http.post('secrets/rsa', (c) => {
      commit('add', c)
    }, {
      name,
      publicKey,
      privateKey
    })
  },

  async createAuth({commit}, {name, username, password}) {
    await http.post('secrets/auth', (c) => {
      commit('add', c)
    }, {
      name,
      username,
      password
    })
  },

  async createToken({commit}, {name, token}) {
    await http.post('secrets/token', (c) => {
      commit('add', c)
    }, {name, token})
  },

  async createAndroidSign({commit}, {name, keyStore, option}) {
    let jsonOptionData = JSON.stringify(option)

    let formData = new FormData()
    formData.append("name", new Blob([name], {type: "text/plain"}))
    formData.append("keyStore", keyStore)
    formData.append("option", new Blob([jsonOptionData], {type: "application/json"}))

    await http.post(
      `secrets/android/sign`,
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

  async delete ({commit}, credential) {
    await http.delete(`secrets/${credential.name}`, (c) => {
      commit('remove', c)
    })
  },

  get ({commit}, name) {
    http.get(`secrets/${name}`, (c) => {
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
