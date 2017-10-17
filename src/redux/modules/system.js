import { handleActions } from 'redux-actions'
import { fromJS, Map } from 'immutable'

import { handleHttp } from '../util'
import { defaultInitState, createHandlers } from 'redux/handler'

import types from './systemType'

const initialState = defaultInitState.set('system', new Map())
const handlers = createHandlers({ id: 'name' })
export const actions = {
  query: function () {
    return {
      name: types.query,
      url: '/index/all',
      transformResponse: function (data) {
        return data.filter((i) => !!i)
      }
    }
  },
  /**
   * @param {string} system 目前 api 只支持 "api", "cc"
   */
  querySystem: function (system) {
    return {
      url: '/sys/:system/info',
      name: types.querySystem,
      indicator: {
        system
      },
      params: {
        system,
      }
    }
  }
}

export default handleActions({
  [types.query]: handleHttp('QUERY', {
    success: handlers.saveAll,
  }),
  [types.querySystem]: handleHttp('QUERY_SYSTEM', {
    success: function (state, { indicator, payload }) {
      const { system } = indicator
      return state.update('system', (sys) => sys.set(system, fromJS(payload)))
    }
  }),
}, initialState)
