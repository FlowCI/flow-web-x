import { OrderedSet, Map } from 'immutable'

export const defaultInitState = new Map({
  list: new OrderedSet(),
  data: new Map(),
  ui: new Map(),
})

export function createInitState (initState) {
  return defaultInitState.merge(initState)
}

function getId (obj, options) {
  return obj[options && options.id ? options.id : 'id']
}

export function saveToData (state, { payload }, options) {
  const id = getId(payload, options)
  return state.mergeIn(['data', id], payload)
}

export function saveAllToData (state, { payload }, options) {
  const d = payload.reduce((s, data) => {
    s[getId(data, options)] = data
    return s
  }, {})

  return state.update('data', (data) => data.merge(d))
}

export function saveToList (state, { payload }, options = {}) {
  const id = getId(payload, options)
  return state.update('list', (list) => list.add(id))
}

export function saveAllToList (state, { payload }, options = {}) {
  const ids = payload.map((data) => getId(data, options))
  const set = new OrderedSet(ids)
  return state.update('list', (list) => list.union(set))
}

export function unshiftToList (state, { payload }, options = {}) {
  const id = getId(payload, options)
  const set = new OrderedSet(id)
  return state.update('list', (list) => set.union(list))
}

export function unshiftAllToList (state, { payload }, options = {}) {
  const ids = payload.map((data) => getId(data, options))
  const set = new OrderedSet(ids)
  return state.update('list', (list) => set.union(list))
}

export function removeFromData (state, { payload }, options) {
  const id = getId(payload, options)
  return state.update('data', (data) => data.delete(id))
}

export function removeAllFromData (state, { payload }, options) {
  const ids = payload.map((data) => getId(data, options))
  return state.update('data', (data) => data.deleteAll(ids))
}

export function removeFromList (state, { payload }, options) {
  const id = getId(payload, options)
  return state.update('list', (list) => list.delete(id))
}

export function removeAllFromList (state, { payload }, options) {
  const ids = payload.map((data) => getId(data, options))
  return state.update('list', (list) => list.deleteAll(ids))
}

export function bindOptions (fn, options) {
  return function (...args) {
    return fn(...args, options)
  }
}

export function composeHandler (...funcs) {
  return function (state, action) {
    return funcs.reduce((s, f) => f(s, action), state)
  }
}

export function bindOptionsCompose (options, ...funcs) {
  return function (state, action) {
    return funcs.reduce((s, f) => f(s, action, options), state)
  }
}

export const handlers = {
  save: saveToData,
  saveAll: composeHandler(saveAllToList, saveAllToData),
  unshift: composeHandler(unshiftToList, saveToData),
  unshiftAll: composeHandler(unshiftAllToList, saveAllToData),
  remove: composeHandler(removeFromList, removeFromData),
  removeAll: composeHandler(removeAllFromList, removeAllFromData),
}
