/**
 * Job childrenResult Module
 * 同后端 Node 模型
 */
import { handleActions } from 'redux-actions'
import { handleHttpActions } from 'redux-http'
import { Map } from 'immutable'

import { defaultInitState, createHandlers } from 'redux/handler'

import types from './jobType'

/**
 * type: { [jobId]: { ids: [], data: {} } }
 */
const initState = new Map()
const handlers = createHandlers({ id: 'order' })

function createState () {
  return defaultInitState
}

export default handleActions({
  [types.get]: handleHttpActions({
    success: function (state, { payload }) {
      const { id: jobId, childrenResult: nodes } = payload
      return state.update(jobId, (s) =>
        handlers.saveAll(createState(), { payload: nodes })
      )
    },
  }),
  [types.freedResource]: function (state, { id }) {
    return state.delete(id)
  }
}, initState)
