import { handleActions } from 'redux-actions'
import FlowTypes from './flowType'

import { handleHttp } from '../util'

import { fromJS } from 'immutable'

import Types from './branchType'
import is from 'util/is'

const initialState = fromJS({ data: {}, ui: {} })

const preposition = (array, item) => {
  const index = array.indexOf(item)
  if (index > -1) {
    array.splice(index, 1)
    return [item].concat(array)
  }
  return array
}

function transformResponse (data) {
  if (is.array(data)) {
    return ['develop', 'master'].reduce(preposition, data)
  }
  return data
}

export const actions = {
  query: function (flowId) {
    return {
      url: '/flows/:flowName/branches',
      params:{
        flowName: flowId,
      },
      name: Types.query,
      indicator: {
        id: flowId,
      },
      transformResponse,
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
