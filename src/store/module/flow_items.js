import http from '../http'
import {FlowWrapper, Root} from "@/util/flows";

function toWrapperList(flowItems) {
  let list = []
  for (let item of flowItems) {
    list.push(new FlowWrapper(item))
  }
  return list
}

function createTreeFromItems(wrapperItems) {
  let groups = {}
  let flows = {}

  for (let item of wrapperItems) {
    if (item.type === 'Group') {
      groups[item.id] = item
      continue
    }

    if (item.type === 'Flow') {
      flows[item.id] = item
    }
  }

  let root = Root
  root.children = []

  for (const [key, value] of Object.entries(groups)) {
    root.children.push(value)
  }

  for (const [key, value] of Object.entries(flows)) {
    if (value.parentId === Root.id) {
      root.children.push(value)
      continue
    }

    const group = groups[value.parentId]
    group.children.push(value)
  }

  return [root]
}

const state = {
  items: [], // FlowWrapper items
  tree: [],
  mappingWithId: {},
  mappingWithName: {},
  isExist: false, // result from action 'exist'
}

const mutations = {
  onListed(state, items) {
    state.items = toWrapperList(items)
    state.mappingWithId = {}
    state.mappingWithName = {}

    state.mappingWithId[Root.id] = Root
    state.mappingWithName[Root.name] = Root

    for (let wrapper of state.items) {
      state.mappingWithId[wrapper.id] = wrapper
      state.mappingWithName[wrapper.name] = wrapper
    }

    state.tree = createTreeFromItems(state.items)
  },

  updateExist(state, isExist) {
    state.isExist = isExist
  },

  addItem(state, item) {
    let wrapper = new FlowWrapper(item);
    state.items.push(wrapper)
    state.tree.push(wrapper)
  },

  addToParent(state, {from, to}) {
    const fromItem = state.mappingWithName[from]
    const toItem = state.mappingWithName[to]

    const fromParentItem = state.mappingWithId[fromItem.parentId]

    // remove from parent
    for (let i = 0; i < fromParentItem.children.length; i++) {
      if (fromParentItem.children[i].name === fromItem.name) {
        fromParentItem.children.splice(i, 1)
        break
      }
    }

    // add to parent
    fromItem.parentId = toItem.id
    toItem.children.push(fromItem)
  },

  delItem(state, wrapper) {
    state.items = state.items.filter((val, _index, _array) => {
      return val.name !== wrapper.name
    })
    state.tree = state.tree.filter((val, _index, _array) => {
      return val.name !== wrapper.name
    })

    if (wrapper.parentId) {
      const parent = state.mappingWithId[wrapper.parentId]
      for (let i = 0; i < parent.children.length; i++) {
        if (parent.children[i].name === wrapper.name) {
          parent.children.splice(i, 1)
          break
        }
      }
    }

    delete state.mappingWithId[wrapper.id]
    delete state.mappingWithId[wrapper.name]
  }
}

const actions = {
  async list({commit}) {
    await http.get(`flows`, (items) => {
      commit('onListed', items)
    })
  },

  async exist({commit}, name) {
    await http.get(`flows/${name}/exist`, (boolVal) => {
      commit('updateExist', boolVal)
    })
  },

  reset({commit}) {
    commit('updateExist', undefined)
  },

  add({commit}, item) {
    commit('addItem', item)
  },

  addToParent({commit}, {from, to}) {
    commit('addToParent', {from, to})
  },

  removeFromParent({commit}, flowName) {
    commit('removeFromParent', flowName)
  },

  remove({commit}, name) {
    commit('delItem', name)
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
