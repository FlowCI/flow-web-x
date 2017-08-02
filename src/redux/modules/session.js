import { handleActions } from 'redux-actions'
import { handleHttp } from '../util'
import { STATUS } from 'redux-http'
import Types from './sessionType'
import { fromJS } from 'immutable'

const initialState = fromJS({ user: undefined, ui: {} })

export const actions = {
  signIn: function (user) {
    return {
      type: Types.signIn,
      status: STATUS.success,
      payload: {
        id: '123123123123',
        name: 'wcy',
        email: 'cy@fir.im',
        avatar: 'https://avatars0.githubusercontent.com/u/5201638'
      }
    }
  },
  signOut: function () { return { type: Types.signOut } },
}

export default handleActions({
  [Types.signIn]: handleHttp('signIn', {
    success: function (state, { payload }) {
      return state.set('user', payload)
    },
  }),
  [Types.signOut]: function (state) {
    return initialState
  }
}, initialState)
