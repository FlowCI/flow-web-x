import { handleActions } from 'redux-actions'
import { handleHttp } from '../util'
import Types from './sessionType'
import { fromJS } from 'immutable'

const initialState = fromJS({
  user: {
    id: '123123123123',
    name: 'wcy',
    email: 'cy@fir.im',
    avatar: 'https://avatars0.githubusercontent.com/u/5201638'
  },
  ui: {},
})

export const actions = {
  signIn: function (user) {
    return {
      url: '/login',
      method: 'post',
      params: user,
      name: Types.signIn,
      mock: true,
      response: {
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
  [Types.signIn]: handleHttp('SIGNIN', {
    success: function (state, { payload }) {
      return state.set('user', payload)
    },
  }),
  [Types.signOut]: function (state) {
    return initialState
  }
}, initialState)
