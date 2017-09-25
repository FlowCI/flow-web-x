/**
 * 用户 - 权限 - Flow 表
 */

import { handleActions } from 'redux-actions'
import { handleHttpActions } from 'redux-http'
import { Map } from 'immutable'

import types from './memberType'

const initialState = new Map()

function save (state, { payload }) {
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

export default handleActions({
  [types.query]: handleHttpActions({
    success: save,
  }),
  [types.updateRoles]: handleHttpActions({
    success: save,
  }),
  [types.freedAll]: function () {
    return initialState
  }
}, initialState)
