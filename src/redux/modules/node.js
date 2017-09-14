/**
 * Job childrenResult Module
 * 同后端 Node 模型
 */
import { handleActions } from 'redux-actions'
import { handleHttpActions } from 'redux-http'
import { Map } from 'immutable'

import { defaultInitState, handlers } from 'redux/handler'

import jobTypes from './jobType'
import types from './nodeType'

/**
 * type: { [jobId]: { ids: [], data: {}, log: { [nodeId]: 'string' } } }
 */
const initState = new Map()

function createState () {
  return defaultInitState.set('log', new Map())
}

export const actions = {
  getLog: function (flowName, jobNumber, nodeOrder) {
    return {
      type: 'GET_JOBNODE_LOG',
      params: {
        flowName,
        jobNumber,
        nodeOrder,
      }
    }
  },
  storeLog: function (node /** Map */, log) {
    return {
      type: types.storeLog,
      payload: {
        jobId: node.get('jobId'),
        id: node.get('id'),
        log,
      }
    }
  }
}

export default handleActions({
  [jobTypes.get]: handleHttpActions({
    success: function (state, { payload }) {
      const { id: jobId, childrenResult: nodes } = payload
      return state.update(jobId, (s) =>
        handlers.saveAll(createState(), { payload: nodes })
      )
    },
  }),
  [jobTypes.freedResource]: function (state, { id }) {
    return state.delete(id)
  },
  [types.storeLog]: function (state, { payload }) {
    const { jobId, id, log } = payload
    return state.updateIn([jobId, 'log', id], (old) => {
      return log + (old || '')
    })
  }
}, initState)
