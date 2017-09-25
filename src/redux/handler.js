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
  // 强制转为 string 型
  return obj[options && options.id ? options.id : 'id'] + ''
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

export function removeAllFromData (state, { payload }) {
  const ids = payload
  return state.update('data', (data) => {
    return ids.reduce((d, id) => d.delete(id), data)
  })
}

export function removeFromList (state, { payload }, options) {
  const id = getId(payload, options)
  return state.update('list', (list) => list.delete(id))
}

export function removeAllFromList (state, { payload }) {
  const ids = payload
  return state.update('list', (list) => {
    return ids.reduce((l, id) => l.delete(id), list)
  })
}

export function bindOptions (options, fn) {
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
export function createHandlers (options) {
  return {
    save: bindOptionsCompose(options, saveToData, saveToList),
    saveAll: bindOptionsCompose(options, saveAllToList, saveAllToData),
    saveData: bindOptions(options, saveToData),

    unshift: bindOptionsCompose(options, unshiftToList, saveToData),
    unshiftAll: bindOptionsCompose(options, unshiftAllToList, saveAllToData),

    remove: bindOptionsCompose(options, removeFromList, removeFromData),
    removeAll: bindOptionsCompose(options, removeAllFromList, removeAllFromData),
  }
}

export const handlers = createHandlers()
