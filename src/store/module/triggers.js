import http from '../http'
import {WebhookHelper} from "@/util/triggers";

const state = {
  items: [],
  loaded: {}
}

const mutations = {
  add(state, notification) {
    state.items.push(notification)
  },

  remove(state, n) {
    for (let i = 0; i < state.items.length; i++) {
      if (state.items[i].id === n.id) {
        state.items.splice(i, 1)
        return
      }
    }
  },

  loaded(state, n) {
    WebhookHelper.SetKvItemsFromParamsAndHeader(n)
    state.loaded = n
  },

  list(state, notifications) {
    state.items = notifications
  }
}

const actions = {
  async list({commit}) {
    await http.get('triggers', (list) => {
      commit('list', list)
    })
  },

  async get({commit}, name) {
    await http.get(`triggers/${name}`, (n) => {
      commit('loaded', n)
    })
  },

  async saveEmail({commit}, payload) {
    await http.post(`triggers/email`, (n) => {
      commit('add', n)
    }, payload)
  },

  async saveWebhook({commit}, payload) {
    await http.post(`triggers/webhook`, (n) => {
      commit('add', n)
    }, payload)
  },

  async delete({commit}, name) {
    await http.delete(`triggers/${name}`, (c) => {
      commit('remove', c)
    })
  }
}

export const Store = {
  namespaced: true,
  state,
  mutations,
  actions
}
