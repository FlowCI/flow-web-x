import { handleActions } from 'redux-actions'
import FlowTypes from './flowType'

import { handleHttp } from '../util'

import { fromJS } from 'immutable'

import Types from './branchType'

const initialState = fromJS({ data: {}, ui: {} })

export const actions = {
  query: function (flowId) {
    return {
      url: '/branches',
      mock: true,
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

function freedHanlder (state, { id }) {
  return state.update('data', (data) => data.delete(id))
    .update('ui', (ui) => ui.delete(id))
}

export default handleActions({
  [Types.query]: handleHttp('QUERY', {
    success: function (state, { indicator: { id }, payload }) {
      return state.update('data', (data) => data.set(id, fromJS(payload)))
    },
  }),
  [Types.freed]: freedHanlder,
  [FlowTypes.freed]: freedHanlder,
}, initialState)
