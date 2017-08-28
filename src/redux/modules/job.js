import { handleActions } from 'redux-actions'
import { handleHttp } from 'redux/util'

import { defaultInitState, handlers } from 'redux/handler'
import is from 'util/is'

import Types from './jobType'
import FlowTypes from './flowType'

const initialState = defaultInitState

function transformResponse (data) {
  if (is.array(data)) {
    data.forEach((d) => {
      d.id = `${d.number}`
    })
  } else if (is.object(data) && data.number > -1) {
    data.id = `${data.number}`
  }
  return data
}

function queryAfterLastest (flowId, filter, lastestId) {
  return function ({ getState, dispatch }) {
    const state = getState()
    const job = state.job.getIn(['data', lastestId])
    if (!job) {
      return query(flowId, filter)
    }
    // do something other
  }
}

function query (flowId, filter) {
  return {
    url: '/jobs',
    name: Types.query,
    params: {
      flowName: flowId,
    },
    transformResponse: transformResponse,
  }
}

export const actions = {
  query: function (flowId, filter, lastestId) {
    const fn = lastestId ? queryAfterLastest : query
    return fn(flowId, filter, lastestId)
  },
  queryLastest: function (flowIds) {
    return {
      name: Types.queryLastest,
      url: 'jobs/status/latest',
      method: 'post',
      data: flowIds,
      transformResponse,
    }
  },
  get: function (flowId, jobId) {
    return {
      name: Types.get,
      url: 'jobs/:flowId/:jobId',
      params: {
        flowId: flowId,
        jobId: jobId,
      },
      indicator: {
        id: jobId,
      },
      transformResponse,
    }
  },
  stop: function (flowId, jobId) {
    return {
      type: 'STOP_JOB',
    }
  },
  setFilter: function (filter) {
    return {
      type: Types.updateFilter,
      payload: filter,
    }
  },
  freedFilter: function () {
    return {
      type: Types.freedFilter,
    }
  }
}

export default handleActions({
  [Types.query]: handleHttp('QUERY', {
    success: handlers.saveAll,
  }),
  [Types.get]: handleHttp('GET', {
    success: handlers.saveData,
  }),
  [Types.updateFilter]: function (state, { payload }) {
    return state.update('ui', (ui) => ui.set('filter', payload))
  },
  [Types.freedFilter]: function (state) {
    return state.update('ui', (ui) => ui.delete('filter'))
  },
  [FlowTypes.freed]: function (state) {
    return initialState
  }
}, initialState)
