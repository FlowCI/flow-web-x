import { handleActions } from 'redux-actions'

import { handleHttp } from '../util'

import { fromJS } from 'immutable'

import Types from './agentType'

const initialState = fromJS({
  data: [],
  ui: {},
})

export const actions = {
  query: function () {
    return {
      url: '/agents',
      name: Types.query,
      // response: [],
      response: [{
        id: 'sss',
        name: 'xiaomi_ios_dev',
        status: 'success',
        job: 'xiaomi_ios_dev / #2 master',
      }, {
        id: 'xxxx',
        name: 'xiaomi_ios_ent',
        status: 'failure',
        job: 'xiaomi_ios_dev / #2 master',
      }],
    }
  },
}

export default handleActions({
  [Types.query]: handleHttp('query', {
    success: function (state, { payload }) {
      return state.set('data', fromJS(payload))
    },
  }),
  [Types.freedAll]: function (state) {
    return initialState
  }
}, initialState)
