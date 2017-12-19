import { handleActions } from 'redux-actions'
import { handleHttp } from '../util'
import { defaultInitState, createHandlers } from 'redux/handler'
import types from './stepType'

const handlers = createHandlers({ id: 'name' })
const initState = defaultInitState

export const actions = {
  query (flowId) {
    return {
      url: '/flows/:flowName/steps',
      name: types.query,
      params: {
        flowName: flowId,
      }
    }
  },
  freed () {
    return {
      type: types.freed,
    }
  }
}

export default handleActions({
  [types.query]: handleHttp('QUERY', {
    success: handlers.saveAll
  }),
  [types.freed]: function () {
    return initState
  }
}, initState)
