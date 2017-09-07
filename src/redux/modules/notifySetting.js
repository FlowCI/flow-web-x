import { handleActions } from 'redux-actions'
import { fromJS } from 'immutable'

import { handleHttpActions } from 'redux-http'

import types from './notifySettingType'

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
  [types.getEmail]: handleHttpActions('GET_EMAIL', {
    success: function (state, { payload }) {
      return state.set('email', fromJS(payload))
    }
  }),
  [types.saveEmail]: handleHttpActions('SAVE_EMAIL', {
    success: function (state, { payload }) {
      return state.set('email', fromJS(payload))
    }
  })
}, initialState)
