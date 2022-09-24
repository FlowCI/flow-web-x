import http from '../http'

const state = {
  metaTypeList: [],
  matrixList: [],
  matrixTotal: {} //
}

const mutations = {

  updateMetaTypeList (state, list) {
    state.metaTypeList = list
  },

  updateMatrixData (state, list) {
    state.matrixList = list
  },

  updateMatrixTotal (stats, matrixList) {
    let matrixTotal = {}
    for (let item of matrixList) {
      matrixTotal[item.flowId] = item
    }
    stats.matrixTotal = matrixTotal;
  }
}

const actions = {

  async metaTypeList({commit}, name) {
    await http.get(`flows/${name}/matrix/types`, (list) => {
      commit('updateMetaTypeList', list)
    })
  },

  async batchTotal({commit}, {flowIdList, metaType}) {
    await http.post(`flows/matrix/batch/total?t=${metaType}`, (matrixList) => {
      commit('updateMatrixTotal', matrixList)
    }, flowIdList)
  },

  async list({commit}, {name, metaType, from, to}) {
    const params = {
      t: metaType,
      from,
      to
    }

    await http.get(`flows/${name}/matrix`, (matrixList) => {
      commit('updateMatrixData', matrixList)
    }, params)
  }
}

export const Store = {
  namespaced: true,
  state,
  mutations,
  actions
}
