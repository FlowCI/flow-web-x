import { handleActions } from 'redux-actions'
import { fromJS, Record } from 'immutable'

import { handleHttp } from 'redux/util'

import types from './notifySettingType'

const EmailSettingRecord = Record({
  'smtpUrl': '',
  'smtpPort': '',
  'username': '',
  'password': '',
  'sender': '',
  isAuthenticated: true,
})

const initialState = fromJS({ ui: {} })

export const actions = {
  getEmailSetting: function () {
    return {
      url: '/message/email/settings',
      name: types.getEmail,
    }
  },
  testEmailSetting: function (setting) {
    return {
      url: '/message/email/settings/auth',
      name: types.testEmail,
      method: 'post',
      params: setting,
    }
  },
  saveEmailSetting: function (setting) {
    return {
      url: '/message/email/settings',
      name: types.saveEmail,
      method: 'post',
      params: setting,
    }
  }
}

export default handleActions({
  [types.getEmail]: handleHttp('GET_EMAIL', {
    success: function (state, { payload }) {
      return state.set('email', new EmailSettingRecord(payload || {}))
    }
  }),
  [types.saveEmail]: handleHttp('SAVE_EMAIL', {
    success: function (state, { payload }) {
      return state.set('email', new EmailSettingRecord(payload || {}))
    }
  })
}, initialState)
