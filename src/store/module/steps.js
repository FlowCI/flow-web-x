// store for steps of selected job

import http from '../http'

const state = {
  flow: null,
  buildNumber: null,
  items: [],
  change: {}, // latest updated object needs to watch
}

const mutations = {
  setJob (state, {flow, buildNumber}) {
    state.flow = flow
    state.buildNumber = buildNumber
  },

  setSteps (state, steps) {
    state.items = steps
  }
}

const actions = {

  /**
   * Get steps for job
   */
  get ({commit}, {flow, buildNumber}) {
    commit('setJob', {flow, buildNumber})

    let url = 'jobs/' + flow + '/' + buildNumber + '/steps'

    http.get(url, (steps) => {
      commit('setSteps', steps)
    })
  },

  update ({commit}, steps) {
    commit('setSteps', steps)
  }
}

export const Store = {
  namespaced: true,
  state,
  mutations,
  actions
}
