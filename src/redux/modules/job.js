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

function getQueryParams (filter, getState) {
  const { branch, keyword, onlySelf, pullRequest } = filter || {}
  const creator = onlySelf ? getState().session.getIn(['user', 'email']) : undefined
  const category = pullRequest ? 'PR' : undefined

  return {
    branch,
    keyword,
    creator,
    category,
  }
}

function queryAfterLastest (flowId, filter, lastestId) {
  return function (dispatch, getState) {
    const state = getState()
    const job = state.job.getIn(['data', lastestId])
    if (!job) {
      return query(flowId, filter)
    }
    // do something other
  }
}

function query (flowId, filter) {
  return function (dispatch, getState) {
    return dispatch({
      url: '/jobs/:flowName',
      name: Types.query,
      params: {
        flowName: flowId,
        ...getQueryParams(filter, getState)
      },
      transformResponse: transformResponse,
    })
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
  /**
   * 如果是已经存过的 job 或者是新 job 则保存，否则丢弃
   */
  saveOrdiscarded: function (job) {
    return {
      type: Types.socketRecived,
      payload: transformResponse(job),
    }
  }
}

export default handleActions({
  [Types.query]: handleHttp('QUERY', {
    success: function (state, action) {
      const nextState = initialState.update('ui', () => state.get('ui'))
      return handlers.saveAll(nextState, action)
    }
  }),
  [Types.get]: handleHttp('GET', {
    success: function (state, { payload }) {
      const job = { ...payload, childrenResult: undefined }
      return handlers.saveData(state, { payload: job })
    },
  }),
  [Types.socketRecived]: function (state, { payload }) {
    const job = { ...payload, childrenResult: undefined }
    const { id, number } = job
    const old = state.getIn(['data', id])
    if (old) {
      return handlers.saveData(state, { payload: job })
    }
    const lastId = state.get('list').last()
    const last = state.getIn(['data', lastId])
    const lastNumber = last ? last.get('number') : 0
    if (lastNumber < number) {
      // save to top list
      return handlers.unshift(state, { payload: job })
    }
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
