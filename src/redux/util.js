import { handleHttpActions } from 'redux-http'
import { OrderedMap, Map } from 'immutable'

function createUIHandler (key) {
  return function (state, { status, id }) {
    return state.update('ui', (ui) => {
      return id ? ui.setIn([key, id], status) : ui.set(key, status)
    })
  }
}

export function combine (...fns) {
  fns = fns.filter((f) => f)
  return function (state, action) {
    return fns.reduceRight((s, fn) => fn(s, action), state)
  }
}

/*
  state must be an Map (immutable) and must has ui instanceOf Map
*/
export function handleHttp (uiName, reducers = {}) {
  return handleHttpActions({
    send: combine(createUIHandler(uiName), reducers.send),
    success: combine(createUIHandler(uiName), reducers.success),
    cancel: combine(createUIHandler(uiName), reducers.cancel),
    failure: combine(createUIHandler(uiName), reducers.failure),
  })
}

export const defaultInitState = new Map({
  data: new OrderedMap(),
  ui: new Map(),
})

export function mergeArray (state, { payload: array }, option = {}) {
  const idKey = option.id || 'id'
  const f = array.reduce((s, item) => {
    const id = item[idKey]
    s[id] = item
    return s
  }, { })
  return state.update('data', (data) => data.merge(f))
}

export function merge (state, { payload: obj }, option = {}) {
  const idKey = option.id || 'id'
  const id = obj[idKey]

  // maybe use merge
  return state.update('data', (data) => data.merge({ [id]: obj }))
}

export function remove (state, { payload: id }) {
  return state.update('ids', (ids) => ids.delete(id))
    .update('data', (data) => data.delete(id))
}
