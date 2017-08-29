import { handleActions } from 'redux-actions'

import { handleHttp } from '../util'

import { fromJS } from 'immutable'

import is from 'util/is'

import Types from './agentType'

const initialState = fromJS({
  list: [],
  ui: {},
})

const transformResponse = function (data) {
  if (is.array(data)) {
    data.forEach((d) => {
      d.id = d.zoneWithName
    })
  }
  return data
}

export const actions = {
  query: function () {
    return {
      url: '/agents',
      name: Types.query,
      transformResponse
    }
  },
  shutdown: function (agent, password) {
    // wait for socket
    return {
      url: '/agents/shutdown',
      method: 'post',
      indicator: {
        id: agent.get('id'),
      },
      params: {
        zone: agent.get('zone'),
        name: agent.get('name'),
        password,
      },
    }
  },
}

export default handleActions({
  [Types.query]: handleHttp('QUERY', {
    success: function (state, { payload }) {
      return state.set('list', fromJS(payload))
    },
  }),
  [Types.shutdown]: handleHttp('SHUTDOWN', {
    success: function (state, { payload }) {

    },
  }),
  [Types.freedAll]: function (state) {
    return initialState
  }
}, initialState)
