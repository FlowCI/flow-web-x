import { handleActions } from 'redux-actions'

import { handleHttp } from '../util'

import { fromJS } from 'immutable'

import Types from './branchType'

const initialState = fromJS({ data: {}, ui: {} })

export const actions = {
  query: function (flowId) {
    return {
      url: '/branches',
      name: Types.query,
      indicator: {
        id: flowId,
      },
      response: [
        'master',
        'develop',
        'feature/xx',
      ],
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
    success: function (state, { id, payload }) {
      return state.update('data', (data) => data.setIn(id, fromJS(payload)))
    },
  }),
  [Types.freed]: function (state, { id }) {
    return state.update('data', (data) => data.delete(id))
  },
}, initialState)
