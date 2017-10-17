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
  } else if (is.object(data)) {
    data.id = data.zoneWithName
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
  remove: function (agent) {
    return {
      url: '/agents/delete',
      method: 'post',
      name: Types.remove,
      indicator: {
        id: agent.get('id'),
      },
      params: {
        zone: agent.get('zone'),
        name: agent.get('name'),
      }
    }
  },
  create: function (zone, name) {
    return {
      url: '/agents/create',
      method: 'post',
      name: Types.create,
      params: {
        zone,
        name,
      },
      transformResponse
    }
  }
}

export default handleActions({
  [Types.query]: handleHttp('QUERY', {
    success: function (state, { payload }) {
      return state.set('list', fromJS(payload))
    },
  }),
  [Types.remove]: handleHttp('REMOVE', {
    success: function (state, { indicator }) {
      const { id } = indicator
      return state.update('list', (list) => {
        return list.filter((item) => item.get('id') !== id)
      })
    },
  }),
  [Types.create]: handleHttp('CREATE', {
    success: function (state, { payload }) {
      return state.update('list', (list) => list.unshift(fromJS(payload)))
    },
  }),
  [Types.freedAll]: function (state) {
    return initialState
  }
}, initialState)
