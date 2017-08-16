import { handleActions } from 'redux-actions'
import { Map, fromJS } from 'immutable'

import is from 'util/is'

import { handleHttp } from 'redux/util'
import { defaultInitState, handlers } from 'redux/handler'
import Types from './flowType'
import JobTypes from './jobType'

const initialState = defaultInitState.set('status', new Map())

const transformResponse = function (data) {
  if (is.array(data)) {
    data.forEach((d) => {
      d.id = d.name
    })
  } else if (is.object(data) && data.name) {
    data.id = data.name
  }
  return data
}
export const actions = {
  query: function () {
    return {
      url: '/flows',
      name: Types.query,
      transformResponse,
    }
  },
  get: function (flowId) {
    return {
      url: '/flows/:path',
      name: Types.get,
      transformResponse,
      params: {
        path: flowId,
      },
      indicator: {
        id: flowId,
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
