// store for steps of selected job

import http from '../http'

const state = {
  flow: null,
  buildNumber: null,
  items: [],
  tasks: [],
  change: {}, // latest updated object needs to watch
}

const mutations = {
  setJob (state, {flow, buildNumber}) {
    state.flow = flow
    state.buildNumber = buildNumber
  },

  setSteps (state, steps) {
    state.items = steps
  },

  setTasks (state, tasks) {
    state.tasks = tasks
  }
}

const actions = {

  /**
   * Get steps for job
   */
  get ({commit}, {flow, buildNumber}) {
    commit('setJob', {flow, buildNumber})
    let url = `jobs/${flow}/${buildNumber}/steps`
    http.get(url, (steps) => {
      commit('setSteps', steps)
    })
  },

  /**
   * Step update from ws push
   */
  update ({commit}, steps) {
    commit('setSteps', steps)
  },

  getTasks({commit}, {flow, buildNumber}) {
    let url = `jobs/${flow}/${buildNumber}/tasks`
    http.get(url, (steps) => {
      commit('setTasks', steps)
    })
  },

  /**
   * Task update from ws push
   */
  updateTasks({commit}, tasks) {
    commit('setTasks', tasks)
  }
}

export const Store = {
  namespaced: true,
  state,
  mutations,
  actions
}
