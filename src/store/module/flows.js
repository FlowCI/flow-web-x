import http from '../http'
import util from "@/util/common"
import {FlowWrapper} from "@/util/flows";

const state = {
  editor: '',
  selected: {obj: {}, yml: ''},
  sshRsa: {publicKey: '', privateKey: ''}, // created ssh-rsa
  gitTestMessage: undefined,  // git test message update
  gitBranches: [],
  itemsByCredential: [],
  users: [], // flow users
  steps: [], // flow steps from yml
  templates: []
}

const mutations = {
  updateSshRsa (state, rsaKeyPair) {
    state.sshRsa = rsaKeyPair
  },

  updateGitTest (state, gitTestMessage) {
    state.gitTestMessage = gitTestMessage
  },

  updateGitBranches (state, branchList) {
    state.gitBranches = branchList
  },

  update (state, updatedFlow) {
    if (state.selected.obj.id === updatedFlow.id) {
      state.selected.obj.rawInstance = updatedFlow
    }
  },

  select (state, flowWrapper) {
    state.selected.obj = flowWrapper
  },

  setYml (state, yml) {
    state.selected.yml = yml
  },

  setTemplates(state, templates) {
    state.templates = templates
  },

  listByCredential (state, items) {
    state.itemsByCredential = items
  },

  editor (state, res) {
    state.editor = res
  },

  listUsers (state, users) {
    state.users = users
  },

  addUsers (state, users) {
    for (let user of users) {
      let exist = state.users.find((x) => x.id === user.id)
      if (!exist) {
        state.users.push(user)
      }
    }
  },

  removeUsers (state, users) {
    state.users = state.users.filter((x) => !users.some((y) => x.id === y.id))
  },

  setYmlObj (state, flowNode) {
    state.steps = flowNode.children
  }
}

const actions = {
  async createSshRsa ({commit, state}) {
    await http.post('secrets/rsa/gen', (rsaKeyPair) => {
      commit('updateSshRsa', rsaKeyPair)
    })
  },

  async gitTestStart ({commit}, wrapper) {
    const url = `flows/${wrapper.name}/git/test`
    await http.post(url,
      () => {
      },
      {
        gitUrl: wrapper.gitUrl,
        secret: wrapper.secret,
        ssh: wrapper.ssh,
        auth: wrapper.auth
      })
  },

  async create ({commit, dispatch}, {wrapper, title}) {
    await http.post(
        `flows/${wrapper.name}`,
        (flow) => {
          console.log(`flow ${wrapper.name} created`)
          dispatch('flowItems/add', flow, {root: true})
        },
        {title}
    )

  },

  async update({commit}, {name, isYamlFromRepo, yamlRepoBranch, jobTimeout, stepTimeout, cron}) {
    await http.post(
        `flows/${name}/settings`,
        (flow) => {
          commit('update', flow)
        },
        {
          isYamlFromRepo,
          yamlRepoBranch,
          jobTimeout,
          stepTimeout,
          cron
        }
    )
  },

  async delete ({commit, state, dispatch}, wrapper) {
    await http.delete(`flows/${wrapper.name}`, () => {
      commit('select', {obj: {}, yml: ''})
      dispatch('flowItems/remove', wrapper, {root: true})
    })
  },

  gitBranches ({commit}, name) {
    const url = `flows/${name}/git/branches`
    return http.get(url, (branches) => {
      commit('updateGitBranches', branches)
    })
  },

  async select ({commit, state}, name) {
    await http.get(`flows/${name}`, (flow) => {
      commit('select', new FlowWrapper(flow))
    })

    await http.get(`flows/${name}/yml/default/obj`, (flowNode) => {
      commit('setYmlObj', flowNode)
    }).catch((e) => {
      console.log(e.message)
    })
  },

  listByCredential ({commit}, secretName) {
    return http.get(`flows/secret/${secretName}`, (list) => {
      commit('listByCredential', list)
    })
  },

  gitTestUpdate ({commit}, gitTestMessage) {
    commit('updateGitTest', gitTestMessage)
  },

  loadYml ({commit, state}, name) {
    if (!name) {
      return
    }

    return http.get(`flows/${name}/yml/default`, (base64Yml) => {
      commit('setYml', util.base64ToUtf8(base64Yml))
    })
  },

  async saveYml ({commit, state}, {name, yml}) {
    if (!name || !yml) {
      return
    }

    await http.post(`flows/${name}/yml/default`,
      () => {
        commit('setYml', yml)
      },
      {
        data: util.utf8ToBase64(yml)
      })
  },

  async templates({commit}) {
    await http.get(`flows/templates`,
        (list) => {
          commit('setTemplates', list)
        })
  },

  editor ({commit}, args) {
    commit('editor', args)
  },

  listUsers ({commit}, name) {
    const onSuccess = (list) => {
      commit('listUsers', list)
    }
    return http.get(`flows/${name}/users`, onSuccess)
  },

  async addUser ({commit}, {name, userEmail}) {
    const onSuccess = (list) => {
      commit('addUsers', list)
    }
    await http.post(`flows/${name}/users`, onSuccess, [ userEmail ])
  },

  async removeUser ({commit}, {name, userEmail}) {
    const onSuccess = (list) => {
      commit('removeUsers', list)
    }
    await http.delete(`flows/${name}/users`, onSuccess, [ userEmail ])
  },

  async addVar ({commit}, {flow, name, value, type}) {
    const payload = {
      [ name ]: {
        data: value,
        type: type
      }
    }

    const onSuccess = () => {
      // commit('addVar', {flow, name, value, type})
    }

    await http.post(`flows/${flow.name}/variables`, onSuccess, payload)
  },

  async removeVar ({commit}, {flow, name}) {
    const payload = [ name ]
    const onSuccess = () => {
      // commit('removeVar', {flow, name})
    }
    await http.delete(`flows/${flow.name}/variables`, onSuccess, payload)
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
