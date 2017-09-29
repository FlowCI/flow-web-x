import { handleActions } from 'redux-actions'
import { handleHttp } from 'redux/util'

import { defaultInitState, handlers } from 'redux/handler'
import is from 'util/is'

import Types from './jobType'
import FlowTypes from './flowType'

const initialState = defaultInitState

export function generatorJobId (flowId, jobNumber) {
  return `${flowId}-${jobNumber}`
}

function transformResponse (data) {
  if (is.array(data)) {
    data.forEach((d) => {
      d.id = generatorJobId(d.nodePath, d.number)
    })
  } else if (is.object(data) && data.number > -1) {
    data.id = generatorJobId(data.nodePath, data.number)
    if (data.childrenResult) {
      data.childrenResult.forEach((node) => {
        node.jobId = data.id
        node.id = `${node.order}`
      })
    }
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
    url: '/jobs/:flowName',
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
  get: function (flowId, jobNumber) {
    return {
      name: Types.get,
      url: 'jobs/:flowName/:jobNumber',
      params: {
        flowName: flowId,
        jobNumber: jobNumber,
      },
      indicator: {
        id: generatorJobId(flowId, jobNumber),
      },
      transformResponse,
    }
  },
  create: function (flowId) {
    return {
      url: '/jobs/:flowName',
      method: 'post',
      params: {
        flowName: flowId
      }
    }
  },
  stop: function (flowId, jobNumber) {
    return {
      url: '/jobs/:flowName/:number/stop',
      method: 'post',
      params: {
        flowName: flowId,
        number: jobNumber,
      }
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
  },
  freedResource: function (jobId) {
    return {
      type: Types.freedResource,
      id: jobId,
    }
  },
  storeJob: function (job) {
    return {
      type: Types.socketRecived,
      payload: transformResponse(job),
    }
  }
}

export default handleActions({
  [Types.query]: handleHttp('QUERY', {
    success: handlers.saveAll,
  }),
  [Types.get]: handleHttp('GET', {
    success: function (state, { payload }) {
      const job = { ...payload, childrenResult: undefined }
      return handlers.saveData(state, { payload: job })
    },
  }),
  [Types.socketRecived]: function (state, { payload }) {
    const job = { ...payload, childrenResult: undefined }
    return handlers.saveData(state, { payload: job })
  },
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
