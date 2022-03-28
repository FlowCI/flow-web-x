import http from '../http'
import {WebhookHelper} from "@/util/triggers";

const state = {
  items: [],
  loaded: {},
  delivery: {
    items: [],
    pagination: {
      page: 0,
      size: 10,
      total: 0
    }
  }
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
  },

  updateDeliveries(state, page) {
    console.log(page)

    state.delivery.items = page.content
    state.delivery.pagination.page = page.number
    state.delivery.pagination.size = page.size
    state.delivery.pagination.total = page.totalElements
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
  },

  async deliveries({commit, state}, {name, page, size}) {
    await http.get(`triggers/${name}/deliveries`,
      (items) => {
        commit('updateDeliveries', items)
      },
      {
        page: page - 1,
        size
      }
    )
  }
}

export const Store = {
  namespaced: true,
  state,
  mutations,
  actions
}
