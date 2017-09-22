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
  }
}

export default handleActions({
  [types.query]: handleHttp('QUERY', {
    success: handlers.saveAll,
  })
}, initialState)
