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
      url: '/flows/:flowName',
      name: Types.get,
      transformResponse,
      params: {
        flowName: flowId,
      },
      indicator: {
        id: flowId,
      }
    }
  },
  create: function (flowId) {
    return {
      url: '/flows/:flowName',
      name: Types.create,
      params: {
        flowName: flowId,
      },
      indicator: {
        id: flowId,
      },
      transformResponse,
    }
  },
  updateEnv: function (flowId, env) {
    return {
      url: '/flows/:flowName',
      name: Types.updateEnv,
      params: {
        flowName: flowId,
      },
      indicator: {
        id: flowId,
      },
      transformResponse,
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
  [Types.get]: handleHttp('GET', {
    success: handlers.save,
  }),
  [Types.create]: handleHttp('GET', {
    success: handlers.save,
  }),
  [Types.updateEnv]: handleHttp('UPDATE', {
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

  // Job Type
  [JobTypes.queryLastest]: handleHttp('QUERY_LAST_JOBS', {
    success: function (state, { payload: jobs }) {
      const f = jobs.reduce((s, job) => {
        s[job.nodeName] = job
        return s
      }, {})
      return state.set('status', fromJS(f))
    }
  }),
}, initialState)
