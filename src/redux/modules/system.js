import { handleActions } from 'redux-actions'

import { handleHttp } from '../util'
import { defaultInitState, createHandlers } from 'redux/handler'

import types from './systemType'

const initialState = defaultInitState
const handlers = createHandlers({ id: 'name' })
export const actions = {
  query: function () {
    return {
      name: types.query,
      url: '/index/all'
    }
  }
}

export default handleActions({
  [types.query]: handleHttp('QUERY', {
    success: handlers.saveAll,
  })
}, initialState)
