import http from '../http'

const state = {
    items: [],
    isExist: false, // result from action 'exist'
}

const mutations = {
    onListed(state, items) {
        state.items = items
    },

    updateExist (state, isExist) {
        state.isExist = isExist
    },
}

const actions = {
    async list ({commit}) {
        await http.get(`flows`, (items) => {
            commit('onListed', items)
        })
    },

    async exist ({commit}, name) {
        await http.get(`flows/${name}/exist`, (boolVal) => {
            commit('updateExist', boolVal)
        })
    },

    reset ({commit}) {
        commit('updateExist', undefined)
    },
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
