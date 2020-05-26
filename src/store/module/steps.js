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
  },

  updateSteps (state, steps) {
    for (let item of state.items) {
      for (let newItem of steps) {
        if (item.id === newItem.id && item.status !== newItem.status) {
          Object.assign(item, newItem)
          state.change = newItem
          break
        }
      }
    }
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

  getTasks({commit}, {flow, buildNumber}) {
    let url = `jobs/${flow}/${buildNumber}/tasks`
    http.get(url, (steps) => {
      commit('setTasks', steps)
    })
  },

  /**
   * Step update from ws push
   */
  update ({commit}, steps) {
    commit('updateSteps', steps)
  }
}

export const Store = {
  namespaced: true,
  state,
  mutations,
  actions
}
