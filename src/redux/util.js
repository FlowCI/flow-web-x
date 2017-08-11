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
