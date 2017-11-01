import { handleActions } from 'redux-actions'
import { handleHttp } from '../util'
import Types from './sessionType'
import { fromJS } from 'immutable'
import Storge from 'util/storge'

const st = Storge.get('token')
const su = Storge.get('user')

const validStorge = st && su
const initialState = fromJS({
  token: validStorge ? st : undefined,
  user: validStorge ? su : undefined,
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
  signOut: function () { return { type: Types.signOut } },
}

export default handleActions({
  [Types.signIn]: handleHttp('SIGNIN', {
    success: function (state, { payload }) {
      const { token, user } = payload
      Storge.set('token', token)
      Storge.set('user', user)
      return state.set('user', user).set('token', token)
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
