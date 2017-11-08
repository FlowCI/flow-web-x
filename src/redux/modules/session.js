import { handleActions } from 'redux-actions'
import { handleHttp } from '../util'
import Types from './sessionType'
import { fromJS } from 'immutable'
import Storge from 'util/storge'

const st = Storge.get('token')
const su = Storge.get('user')

const validStorge = st && su
const initialState = fromJS({
  ui: {},
})
const nState = initialState.set('token', fromJS(validStorge ? st : undefined))
  .set('user', fromJS(validStorge ? su : undefined))

export const actions = {
  signIn: function (user) {
    return {
      url: '/user/login',
      method: 'post',
      params: user,
      name: Types.signIn
    }
  },
  signOut: function () { return { type: Types.signOut } },
}

export default handleActions({
  [Types.signIn]: handleHttp('SIGNIN', {
    success: function (state, { payload }) {
      const { token, user } = payload
      const { roles = [] } = user
      const isAdmin = roles.some((r) => r.name === 'ADMIN')

      const u = {
        ...user,
        isAdmin,
        roles: undefined
      }
      Storge.set('token', token)
      Storge.set('user', u)
      return state.set('user', fromJS(u)).set('token', token)
    },
  }),
  [Types.signOut]: function (state) {
    Storge.clear('token')
    Storge.clear('user')
    return initialState
  },
  // dispatch from header middleware
  'ACCESSTOKEN/INVALID': function (state) {
    Storge.clear('token')
    Storge.clear('user')
    return initialState
  }
}, nState)
