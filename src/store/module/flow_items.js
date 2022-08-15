import http from '../http'
import {FlowWrapper, toWrapperList} from "@/util/flows";

const state = {
    items: [], // FlowWrapper items
    mappingWithId: {},
    mappingWithName: {},
    isExist: false, // result from action 'exist'
}

const mutations = {
    onListed(state, items) {
        state.items = toWrapperList(items)

        state.mappingWithId = {}
        state.mappingWithName = {}

        for (let wrapper of state.items) {
            state.mappingWithId[wrapper.id] = wrapper
            state.mappingWithName[wrapper.name] = wrapper
        }
    },

    updateExist (state, isExist) {
        state.isExist = isExist
    },

    addItem(state, item) {
        state.items.push(new FlowWrapper(item))
    }
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

    add({commit}, item) {
        commit('addItem', item)
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
