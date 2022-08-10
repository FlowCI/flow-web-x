import http from '../http'

const state = {
    items: [],
    mappingWithId: {}
}

const mutations = {
    onListed(state, group) {
        state.mappingWithId[group.id] = group
        state.items.push(group)
    }
}

const actions = {
    async list ({commit}) {
        await http.post(`flow_groups/${name}`, (group) => {
            commit('onCreated', group)
        })
    },
}