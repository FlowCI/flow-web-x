import { handleActions } from 'redux-actions'

import { handleHttp } from '../util'
import { defaultInitState, handlers } from 'redux/handler'

import types from './roleType'

const initialState = defaultInitState

export const actions = {
  query: function () {
    return {
      name: types.query,
      url: '/roles',
    }
  },
  freedAll: function () {
    return {
      type: types.freedAll,
    }
  }
}

export default handleActions({
  [types.query]: handleHttp('QUERY', {
    success: handlers.saveAll,
  }),
  [types.freedAll]: function () {
    return initialState
  }
}, initialState)
