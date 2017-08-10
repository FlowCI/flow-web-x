import { handleHttpActions } from 'redux-http'

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
/*
  set array[index].id to state.ids, and array[index] to state.data
*/
export function mergeArray (state, array, idKey = 'id') {
  return array.reduce((s, d) => merge(s, d, idKey), state)
}

export function merge (state, item, idKey = 'id') {
  const id = item[idKey]
  return state.update('ids', (ids) => ids.push(id))
    .update('data', (data) => data.set(id, item)) // maybe use merge
}

export function remove (state, id) {
  return state.update('ids', (ids) => {
    const i = ids.indexOf(id)
    i > -1 && ids.delete(i)
  }).update('data', (data) => data.delete(id))
}
