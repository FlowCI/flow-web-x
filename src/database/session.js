import types from 'redux/modules/sessionType'

export default {
  [types.signIn]: function ({ params: { email } }) {
    return {
      id: '123123123123',
      name: 'wcy',
      email: email || 'cy@fir.im',
      avatar: 'https://avatars0.githubusercontent.com/u/5201638'
    }
  },
}
