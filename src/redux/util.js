import { handleHttpActions } from 'redux-http'
import { fromJS, OrderedSet, Map } from 'immutable'

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

/*
 only can use in state = { ...other, ids: List, data: Map,  }
*/

// set array[index].id to state.ids, and array[index] to state.data
export const defaultInitState = new Map({
  ids: new OrderedSet(), // use in list, some data maybe want not show in list view
  data: new Map(),
  ui: new Map(),
})

export function mergeArray (state, { payload: array }, option = {}) {
  const idKey = option.id || 'id'
  const f = array.reduce((s, item) => {
    const id = item[idKey]
    !option.skipIds && s.ids.push(id)
    s.data[id] = item
    return s
  }, { ids: [], data: {} })
  return state.update('ids', (ids) => ids.concat(f.ids))
    .update('data', (data) => data.merge(new Map(f.data)))
}

export function merge (state, { payload: obj }, option = {}) {
  const idKey = option.id || 'id'
  const id = obj[idKey]

  // maybe use merge
  const nextState = state.update('data', (data) => data.set(id, fromJS(obj)))
  return option.skipIds ? nextState
    : nextState.update('ids', (ids) => ids.add(id))
}

export function remove (state, { payload: id }) {
  return state.update('ids', (ids) => ids.delete(id))
    .update('data', (data) => data.delete(id))
}
