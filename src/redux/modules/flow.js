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
      transformResponse: [function (data) {
        return data.map((d) => {
          d.id = d.name
          return d
        })
      }],
      response: [{
        'path': '/flow',
        'name': 'flow',
        'createdAt': 1502418628,
        'updatedAt': 1502418628
      }, {
        'path': '/flow-a',
        'name': 'flow-a',
        'createdAt': 1502691673,
        'updatedAt': 1502691686
      }, {
        'path': '/flow-test',
        'name': 'flow-test',
        'createdAt': 1502691156,
        'updatedAt': 1502691269
      }]
    }
  },
  get: function (flowId) {
    // 暂时没有
    return {
      type: 'UNSUPPORTED'
    }
    // return {
    //   url: '/flows/:path',
    //   name: Types.get,
    //   params: {
    //     path: flowId,
    //   },
    //   indicator: {
    //     id: flowId,
    //   },
    //   response: {
    //     id: flowId,
    //     path: flowId,
    //     name: 'xiaomi_ios_dev',
    //     status: 'success',
    //   }
    // }
  },
  freed: function (flowId) {
    return {
      type: Types.freed,
      id: flowId,
    }
  },
}

export default handleActions({
  [Types.query]: handleHttp('QUERY', {
    success: handlers.saveAll,
  }),

  [Types.get]: handleHttp('GET', {
    success: handlers.save,
  }),

  [Types.freedAll]: function (state) {
    return initialState
  }
}, initialState)
