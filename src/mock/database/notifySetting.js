import types from 'redux/modules/notifySettingType'

export default {
  [types.getEmail]: function () {
    return {
      'smtpUrl': '',
      'smtpPort': '',
      'username': '',
      'password': '',
      'sender': '',
    }
  },
  [types.testEmail]: function () {
    return {}
  },
  [types.saveEmail]: function ({ params }) {
    return params
  }
}
