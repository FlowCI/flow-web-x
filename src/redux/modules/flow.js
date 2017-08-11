import { handleActions } from 'redux-actions'

import { handleHttp } from 'redux/util'
import { defaultInitState, handlers } from 'redux/handler'
import Types from './flowType'

const initialState = defaultInitState

export const actions = {
  query: function () {
    return {
      url: '/flows',
      name: Types.query,

      response: [{
        id: 'xiaomi_ios_dev',
        path: 'sss',
        name: 'xiaomi_ios_dev',
        status: 'success',
      }, {
        id: 'xiaomi_ios_ent',
        path: 'xxxx',
        name: 'xiaomi_ios_ent',
        status: 'failure',
      }]
    }
  },
  get: function (flowId) {
    return {
      url: '/flows/:path',
      name: Types.get,
      params: {
        path: flowId,
      },
      indicator: {
        id: flowId,
      },
      response: {
        id: flowId,
        path: flowId,
        name: 'xiaomi_ios_dev',
        status: 'success',
      }
    }
  },
  freed: function (flowId) {
    return {
      type: Types.freed,
      id: flowId,
    }
  },
}

export default handleActions({
  [Types.query]: handleHttp('query', {
    success: handlers.saveAll,
  }),

  [Types.get]: handleHttp('get', {
    success: handlers.save,
  }),

  [Types.freedAll]: function (state) {
    return initialState
  }
}, initialState)
