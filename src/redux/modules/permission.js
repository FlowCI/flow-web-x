/**
 * 用户 - 权限 - Flow 表
 */

import { handleActions } from 'redux-actions'
import { Map } from 'immutable'

import { handleHttp } from '../util'

import types from './userType'

const initialState = new Map()

export default handleActions({
  [types.query]: handleHttp('QUERY', {
    success: function (state, { payload }) {
      const { users } = payload
      const mapping = users.reduce((s, user) => {
        s[user.email] = {
          flows: user.flows,
          roles: user.roles,
        }
        return s
      }, {})
      return state.merge(mapping)
    }
  }),
  [types.freedAll]: function () {
    return initialState
  }
}, initialState)
