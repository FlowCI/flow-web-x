import http from '../http'
import { browserDownload } from '../util'
import { LogWrapper } from '@/util/logs'

const commitLog = (commit, cmdId, blob) => {
  const reader = new FileReader()
  reader.onload = (event) => {
    commit('update', [new LogWrapper(cmdId, event.target.result)])
  }
  reader.readAsText(blob)
}

const state = {
  loaded: [], // LogWrapper list been loaded
  cached: {}, // {cmdId, blob}
  pushed: {}, // Protobuf pushed
}

const mutations = {
  update(state, logs) {
    state.loaded = logs
  },

  pushed(state, log) {
    state.pushed = log
  },

  addCache(state, {cmdId, blob}) {
    state.cached[cmdId] = blob
  }
}

const actions = {
  load({commit, state}, stepId) {
    const blob = state.cached[stepId]
    if (blob) {
      console.log('cached')
      commitLog(commit, stepId, blob)
      return
    }

    let url = `jobs/logs/${stepId}/download`
    http.get(url, (data, _file) => {
      let blob = new Blob([data], {type: 'text/plain'})
      commitLog(commit, stepId, blob)
      commit('addCache', {cmdId: stepId, blob: blob})
    })
  },

  download({commit, state}, stepId) {
    let url = `jobs/logs/${stepId}/download`
    http.get(url, (data, file) => {
      const url = window.URL.createObjectURL(new Blob([data]))
      browserDownload(url, file)
    })
  },

  read({commit}, {stepId, onLoaded}) {
    let url = `jobs/logs/${stepId}/read`
    http.get(url, (data) => {
      onLoaded(data)
    })
  },

  push({commit, state}, logFromProto) {
    commit('pushed', logFromProto)
  }
}

export const Store = {
  namespaced: true,
  state,
  mutations,
  actions
}
