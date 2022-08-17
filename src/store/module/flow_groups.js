import http from '../http'

const state = {}

const mutations = {}

const actions = {
  async create({dispatch}, name) {
    await http.post(`flow_groups/${name}`, (group) => {
      dispatch('flowItems/add', group, {root: true})
    })
  },

  delete(name) {

  }
}

/**
 * Export Vuex store object
 */
export const Store = {
  namespaced: true,
  state,
  mutations,
  actions
}