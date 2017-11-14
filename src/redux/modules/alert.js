import { handleActions } from 'redux-actions'

import { defaultInitState, handlers } from 'redux/handler'

import types from './alertType'

export const initState = defaultInitState

function alert (type, message, options) {
  return {
    type: types.add,
    payload: {
      type: type,
      id: new Date().getTime() + '',
      message,
      options,
    }
  }
}

export const actions = {
  alert,
  success: alert.bind(undefined, 'success'),
  warning: alert.bind(undefined, 'warning'),
  info: alert.bind(undefined, 'info'),
  failure: alert.bind(undefined, 'failure'),

  dismiss: function (alertId) {
    return {
      type: types.dismiss,
      payload: {
        id: alertId,
      }
    }
  }
}

export default handleActions({
  [types.add]: handlers.save,
  [types.dismiss]: handlers.remove,
}, initState)
