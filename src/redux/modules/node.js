/**
 * Job childrenResult Module
 * 同后端 Node 模型
 */
import { handleActions } from 'redux-actions'
import { handleHttpActions, STATUS } from 'redux-http'
import { Map } from 'immutable'

import { defaultInitState, handlers } from 'redux/handler'
import { generatorJobId } from './job'

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
    const jobId = generatorJobId(flowName, jobNumber)
    const nodeOrderStr = nodeOrder + ''
    return function (dispatch, getState) {
      const state = getState()
      const { node } = state
      const status = node.getIn([jobId, 'ui', nodeOrderStr, 'GET_LOG'])
      console.log(status)
      if (status === STATUS.send || status === STATUS.success) {
        return
      }
      return dispatch({
        url: '/jobs/:flowName/:jobNumber/:nodeOrder',
        name: types.getLog,
        params: {
          flowName,
          jobNumber,
          nodeOrder: nodeOrderStr,
        },
        indicator: {
          jobId: jobId,
          nodeId: nodeOrderStr,
        }
      })
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
  [types.getLog]: handleHttpActions({
    send: function (state, { indicator, status }) {
      const { jobId, nodeId } = indicator
      return state.setIn([jobId, 'ui', nodeId, 'GET_LOG'], status)
    },
    success: function (state, { indicator, payload, status }) {
      const { jobId, nodeId } = indicator
      return state.updateIn([jobId, 'log', nodeId], (old) => {
        return payload + (old || '')
      }).setIn([jobId, 'ui', nodeId, 'GET_LOG'], status)
    },
    failure: function (state, { indicator, status }) {
      const { jobId, nodeId } = indicator
      return state.setIn([jobId, 'ui', nodeId, 'GET_LOG'], status)
    },
    cancel: function (state, { indicator, status }) {
      const { jobId, nodeId } = indicator
      return state.setIn([jobId, 'ui', nodeId, 'GET_LOG'], status)
    },
  }),
  [jobTypes.socketRecived]: function (state, { payload }) {
    const { id: jobId, childrenResult: nodes } = payload
    return state.update(jobId, (s) =>
      handlers.saveAll(createState(), { payload: nodes })
    )
  },
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
