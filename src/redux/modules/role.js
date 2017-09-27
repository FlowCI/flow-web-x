import { handleActions } from 'redux-actions'

import { handleHttp } from '../util'
import { defaultInitState, createHandlers } from 'redux/handler'

import types from './roleType'

const initialState = defaultInitState
const handlers = createHandlers({ id: 'name' })
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
    success: function (state, actions) {
      const s = initialState.update('ui', () => state.get('ui'))
      return handlers.saveAll(s, actions)
    },
  }),
  [types.freedAll]: function () {
    return initialState
  }
}, initialState)
