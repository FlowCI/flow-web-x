import { handleActions } from 'redux-actions'
import { handleHttp } from '../util'
import Types from './sessionType'
import { fromJS } from 'immutable'
import Storge from 'util/storge'

const initialState = fromJS({
  token: Storge.get('token'),
  ui: {},
})

export const actions = {
  signIn: function (user) {
    return {
      url: '/user/login',
      method: 'post',
      params: user,
      name: Types.signIn,
    }
  },
  getUser: function () {
    return {
      url: '/user/show',
      name: Types.getUser,
    }
  },
  signOut: function () { return { type: Types.signOut } },
}

export default handleActions({
  [Types.signIn]: handleHttp('SIGNIN', {
    success: function (state, { payload }) {
      const { token, user } = payload
      Storge.set('token', token)
      return state.set('user', user).set('token', token)
    },
  }),
  [Types.getUser]: handleHttp('SIGNIN', {
    success: function (state, { payload }) {
      return state.set('user', payload)
    },
  }),
  [Types.signOut]: function (state) {
    return initialState
  },
  // dispatch from header middleware
  'ACCESSTOKEN/INVALID': function (state) {
    return initialState
  }
}, initialState)
