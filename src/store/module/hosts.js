/**
 * Agent host module
 */

import http from '../http'

const state = {
  items: [],
  loaded: null,
  updated: null
}

const mutations = {
  reload (state, hosts) {
    state.items = hosts
  },

  loaded (state, host) {
    state.loaded = host
  },

  add (state, newOrUpdated) {
    for (let host of state.items) {
      if (host.id === newOrUpdated.id) {
        Object.assign(host, newOrUpdated)
        return
      }
    }

    state.items.push(newOrUpdated)
  },

  updateOnly (state, updated) {
    state.updated = updated
  },

  remove (state, deletedHost) {
    for (let i = 0; i < state.items.length; i++) {
      if (state.items[i].id === deletedHost.id) {
        state.items.splice(i, 1)
        return;
      }
    }
  },
}

const actions = {
  async list ({commit}) {
    await http.get('hosts', (hosts) => {
      commit('reload', hosts)
    })
  },

  async createOrUpdate ({commit}, obj) {
    await http.post('hosts', (host) => {
      commit('add', host)
    }, obj)
  },

  async get ({commit}, name) {
    await http.get(`hosts/${name}`, (host) => {
      commit('loaded', host)
    })
  },

  async delete ({commit}, name) {
    await http.delete(`hosts/${name}`, (host) => {
      commit('remove', host)
    })
  },

  async test({commit}, name) {
    await http.post(`hosts/${name}/test`, () => {})
  },

  updated({commit}, host) {
    commit('add', host)
    commit('updateOnly', host)
  }
}

export const Store = {
  namespaced: true,
  state,
  mutations,
  actions
}
