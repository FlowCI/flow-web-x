import { handleActions } from 'redux-actions'

import { handleHttp } from '../util'

import { fromJS } from 'immutable'

import Types from './agentType'

const initialState = fromJS({
  list: [],
  ui: {},
})

export const actions = {
  query: function () {
    return {
      url: '/agents',
      name: Types.query,
      transformResponse: [function (data) {
        return data.map((d) => {
          d.id = d.zoneWithName
          return d
        })
      }],
      response: [{
        'name': 'defaultp',
        'zone': 'default',
        'agentStatus': 'IDLE',
        'zoneWithName': 'defaultp - default'
      }, {
        'name': 'fir-machine-1',
        'zone': 'default',
        'agentStatus': 'IDLE',
        'zoneWithName': 'fir-machine-1 - default'
      }],
    }
  },
}

export default handleActions({
  [Types.query]: handleHttp('QUERY', {
    success: function (state, { payload }) {
      return state.set('list', fromJS(payload))
    },
  }),
  [Types.freedAll]: function (state) {
    return initialState
  }
}, initialState)
