import { handleActions } from 'redux-actions'

import { handleHttp } from '../util'
import { STATUS } from 'redux-http'

import { fromJS } from 'immutable'

import Types from './flowType'

const initialState = fromJS({
  list: [],
  ui: {},
})

export const actions = {
  query: function () {
    return {
      type: Types.query,
      status: STATUS.success,
      payload: [{
        id: 'xiaomi_ios_dev',
        path: 'sss',
        name: 'xiaomi_ios_dev',
        status: 'success',
      }, {
        id: 'xiaomi_ios_ent',
        path: 'xxxx',
        name: 'xiaomi_ios_ent',
        status: 'failure',
      }]
    }
  },
}

export default handleActions({
  [Types.query]: handleHttp('query', {
    success: function (state, { payload }) {
      return state.set('list', fromJS(payload))
    },
  }),
  [Types.freedAll]: function (state) {
    return initialState
  }
}, initialState)
