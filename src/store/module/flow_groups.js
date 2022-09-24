import http from '../http'

const state = {}

const mutations = {}

const actions = {
  async create({dispatch}, name) {
    await http.post(`flow_groups/${name}`, (group) => {
      dispatch('flowItems/add', group, {root: true})
    })
  },

  async addToGroup({dispatch}, {groupName, flowName}) {
    await http.post(`flow_groups/${groupName}/${flowName}`, () => {
      dispatch('flowItems/addToParent', {from: flowName, to: groupName}, {root: true})
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