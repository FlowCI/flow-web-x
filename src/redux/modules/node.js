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
 * type: {
 *  [jobId]: {
 *    ids: [],
 *    data: {},
 *    log: {
 *      [nodeId]: {
 *        line: [number],  最后一行行号
 *        str: [string] 日志内容
 *      }
 *    }
 *  }
 * }
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
      if (status === STATUS.send || status === STATUS.success) {
        return
      }
      return dispatch({
        url: '/jobs/:flowName/:jobNumber/:nodeOrder/log',
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
  /**
   * @param {object} log { number: number, content: string }
   */
  storeLog: function (node /** Map */, log) {
    return {
      type: types.storeLog,
      payload: {
        jobId: node.get('jobId'),
        id: node.get('id'),
        log: log,
      }
    }
  }
}

const maxLogLength = 1000

function beforeStoreLog (log, maxLength = maxLogLength) {
  const array = log.split('\n')
  if (array.length < maxLength) {
    return log
  }
  return array.slice(array.length - maxLength).join('\n')
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
      const line = (payload + '').split('\n').length
      return state.updateIn([jobId, 'log', nodeId], (old) => {
        return new Map({ line, str: beforeStoreLog(payload) })
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
    return state.update(jobId, (s) => {
      if (!s) { return }
      return handlers.saveAll(createState().merge(s), { payload: nodes })
    })
  },
  [jobTypes.freedResource]: function (state, { id }) {
    return state.delete(id)
  },
  [types.storeLog]: function (state, { payload }) {
    const { jobId, id, log } = payload
    const { number, content } = log
    return state.updateIn([jobId, 'log', id], (old) => {
      if (old) {
        if (old.get('line') < number) {
          return new Map({
            line: number,
            str: beforeStoreLog([old.get('str'), content].join('\n')),
          })
        }
        return old
      } else {
        return new Map({ line: number, str: beforeStoreLog(content) })
      }
    })
  }
}, initState)
