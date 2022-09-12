import http from '../http'

const state = {
  metaTypeList: [],
  statsList: [],
  statsTotal: {}
}

const mutations = {

  updateMetaTypeList (state, list) {
    state.metaTypeList = list
  },

  updateStatsData (state, list) {
    state.statsList = list
  },

  updateStatsTotal (stats, total) {
    stats.statsTotal = total;
  }
}

const actions = {

  async metaTypeList({commit}, name) {
    await http.get(`flows/${name}/matrix/types`, (list) => {
      commit('updateMetaTypeList', list)
    })
  },

  async total({commit}, {name, metaType}) {
    const params = {
      t: metaType
    }

    await http.get(`flows/${name}/matrix/total`, (total) => {
      commit('updateStatsTotal', total)
    }, params)
  },

  async list({commit}, {name, metaType, from, to}) {
    const params = {
      t: metaType,
      from,
      to
    }

    await http.get(`flows/${name}/matrix`, (statsList) => {
      commit('updateStatsData', statsList)
    }, params)
  }
}

export const Store = {
  namespaced: true,
  state,
  mutations,
  actions
}
