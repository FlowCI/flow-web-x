import { handleActions } from 'redux-actions'
import { fromJS } from 'immutable'

import { handleHttp } from '../util'

import types from './credentialType'

export const actions = {
  query: function () {
    return {
      url: '/credentials',
      name: types.query,
    }
  },
  create: function () {
    return {
      name: types.create,
      url: '/credentials',
      method: 'post',
    }
  },
}

const initialState = fromJS({
  ios: [],
  rsa: [],
  ui: {},
})

export default handleActions({
  [types.query]: handleHttp('QUERY', {
    success: function (state, { payload }) {
      const { ios, rsa } = payload
      return state.update('ios', () => fromJS(ios))
        .update('rsa', () => fromJS(rsa))
    }
  })
}, initialState)
