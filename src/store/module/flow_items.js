import http from '../http'
import {FlowWrapper} from "@/util/flows";

function toWrapperList(flowList) {
  let list = []
  for (let item of flowList) {
    console.log(item)
    list.push(new FlowWrapper(item))
  }
  return list
}

function createTreeFromItems(wrapperItems) {
  // key = id, value = flow wrapper
  let maps = {}

  for (let item of wrapperItems) {
    maps[item.id] = item
  }

  for (let item of wrapperItems) {
    if (item.isRoot) {
      var root = item
      continue
    }

    let parent = maps[item.parentId]
    parent.children.push(item)
  }

  return [root]
}

const state = {
  items: [], // FlowWrapper items
  tree: [],
  isExist: false, // result from action 'exist'
}

const mutations = {
  onListed(state, items) {
    state.items = toWrapperList(items)
    state.tree = createTreeFromItems(state.items)
  },

  addItem(state, item) {
    let wrapper = new FlowWrapper(item);
    state.items.push(wrapper)
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
    await http.get(`/v2/flows`, (items) => {
      commit('onListed', items)
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
