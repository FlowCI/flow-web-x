import { handleActions } from 'redux-actions'
import { Map, fromJS } from 'immutable'

import { handleHttp } from 'redux/util'
import { defaultInitState, handlers } from 'redux/handler'
import Types from './flowType'
import JobTypes from './jobType'

const initialState = defaultInitState.set('status', new Map())

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
  queryLastJob: function (flowIds) {
    return {
      name: JobTypes.queryLastest,
      url: 'jobs/status/latest',
      method: 'post',
      data: flowIds,
      transformResponse: [function (data) {
        return data.reduce(function (s, d) {
          s[d.nodeName] = d
          return s
        }, {})
      }]
    }
  },
  setDropDownFilter: function (filter) {
    return {
      type: Types.setDropDownFilter,
      payload: filter,
    }
  },
  freedDropDownFilter: function () {
    return {
      type: Types.freedDropDownFilter,
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
  [Types.query]: handleHttp('QUERY', {
    success: handlers.saveAll,
  }),
  [JobTypes.queryLastest]: handleHttp('QUERY_JOBS', {
    success: function (state, { payload }) {
      return state.set('status', fromJS(payload))
    }
  }),
  [Types.get]: handleHttp('GET', {
    success: handlers.save,
  }),
  [Types.setDropDownFilter]: function (state, { payload }) {
    return state.update('ui', (ui) => ui.set('dropDownFilter', payload))
  },
  [Types.freedDropDownFilter]: function (state) {
    return state.update('ui', (ui) => ui.delete('dropDownFilter'))
  },
  [Types.freedAll]: function (state) {
    return initialState
  },

}, initialState)
