import http from '../http'
import md5 from 'blueimp-md5'

const state = {
  actions: [],
  items: [], // user list
  total: 0
}

const mutations = {
  list (state, page) {
    state.items = page.content
    state.total = page.totalElements
  },

  add (state, user) {
    state.items.push(user)
    state.total += 1
  },

  saveActions(state, actions) {
    state.actions = actions
  },

  updateRole (state, {email, role}) {
    for (let item of state.items) {
      if (item.email === email) {
        item.role = role
        return
      }
    }
  }
}

const actions = {
  async listActions({commit}) {
    const onSuccess = (actions) => {
      commit('saveActions', actions)
    }
    await http.get('users/actions', onSuccess)
  },

  hasDefault({commit}, {onSuccess}) {
    return http.get('users/default', onSuccess)
  },

  createDefault({commit}, {email, pw, onSuccess}) {
    return http.post('users/default', onSuccess, {
      email,
      password: md5(pw, null, false),
      role: 'Admin'
    })
  },

  listAll ({commit}, {page, size}) {
    const onSuccess = (page) => {
      commit('list', page)
    }
    return http.get('users', onSuccess, {page: page - 1, size})
  },

  async changePassword ({commit}, {old, newOne, confirm}) {
    const onSuccess = () => {
    }
    await http.post('users/change/password', onSuccess, {
      old: md5(old, null, false),
      newOne: md5(newOne, null, false),
      confirm: md5(confirm, null, false)
    })
  },

  async changeRole ({commit}, {email, role}) {
    const onSuccess = () => {
      commit('updateRole', {email, role})
    }
    await http.post('users/change/role', onSuccess, {email, role})
  },

  async create ({commit}, {email, password, role}) {
    const onSuccess = (user) => {
      commit('add', user)
    }
    await http.post('users', onSuccess, {
      email,
      password: md5(password, null, false),
      role
    })
  }
}

export const Store = {
  namespaced: true,
  state,
  mutations,
  actions
}
