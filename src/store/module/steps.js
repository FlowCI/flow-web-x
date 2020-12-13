// store for steps of selected job

import http from '../http'
import {StepWrapper} from '@/util/steps'

const state = {
  flow: null,
  buildNumber: null,
  maxHeight: 1, // max parallel height
  root: {}, // root StepWrapper
  items: [], // StepWrapper instance list
  tasks: [],
  change: {}, // latest updated object needs to watch
}

const mutations = {
  setJob(state, {flow, buildNumber}) {
    state.flow = flow
    state.buildNumber = buildNumber
  },

  setSteps(state, steps) {
    let wrappers = []
    let mapping = {}
    state.maxHeight = 1

    // create instances
    steps.forEach((step) => {
      let w = new StepWrapper(step)
      wrappers.push(w)
      mapping[w.path] = w

      if (!step.parent) {
        state.root = w
      }
    })

    // link next and parent
    wrappers.forEach((w) => {
      if (!w.nextPaths) {
        return
      }

      let height = 0
      for (let path of w.nextPaths) {
        const next = mapping[path]
        w.next.push(next)
        height++
      }

      if (w.isParallel) {
        if (state.maxHeight < height) {
          state.maxHeight = height
        }
      }

      w.parent = mapping[w.parentPath]
    })

    console.log(state.maxHeight)
    state.items = wrappers
  },

  setTasks(state, tasks) {
    state.tasks = tasks
  }
}

const actions = {

  /**
   * Get steps for job
   */
  get({commit}, {flow, buildNumber}) {
    commit('setJob', {flow, buildNumber})
    let url = `jobs/${flow}/${buildNumber}/steps`
    http.get(url, (steps) => {
      commit('setSteps', steps)
    })
  },

  /**
   * Step update from ws push
   */
  update({commit}, steps) {
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
