import { handleActions } from 'redux-actions'
import { fromJS, Map } from 'immutable'

import { handleHttp } from '../util'
import { defaultInitState, createHandlers } from 'redux/handler'

import types from './systemType'

const handlers = createHandlers({ id: 'name' })
/**
 * 将 web 版本号添加进去
 */
const initialState = handlers.save(
  defaultInitState.set('services', new Map()),
  {
    payload: {
      name: 'Web',
      version: VERSION,
    }
  }
)

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
  queryServices: function (system) {
    return {
      url: '/sys/:system/info',
      name: types.queryServices,
      indicator: {
        system
      },
      params: {
        system,
      }
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
  [types.queryServices]: handleHttp('QUERY_SYSTEM', {
    success: function (state, { indicator, payload }) {
      const { system } = indicator
      return state.update('services', (s) => s.set(system, fromJS(payload)))
    }
  }),
  [types.freedAll]: function () {
    return initialState
  }
}, initialState)
