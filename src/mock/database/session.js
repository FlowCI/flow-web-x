import types from 'redux/modules/sessionType'

export default {
  [types.signIn]: function ({ params: { emailOrUsername } }) {
    const isEmail = emailOrUsername && emailOrUsername.includes('@')
    return {
      token: 'xxxx',
      user: {
        name: isEmail ? 'xxx' : emailOrUsername,
        email: isEmail ? emailOrUsername : 'dev@fir.im',
        avatar: 'https://avatars0.githubusercontent.com/u/5201638'
      }
    }
  },
  [types.getUser]: function () {
    return {
      name: 'xxx',
      email: 'dev@fir.im',
      avatar: 'https://avatars0.githubusercontent.com/u/5201638'
    }
  }
}
