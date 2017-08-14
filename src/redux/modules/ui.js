import { handleActions } from 'redux-actions'
import Types from './uiType'
import { fromJS } from 'immutable'

const initialState = fromJS({})

export const actions = {
  setBackUrl: function (url) {
    return {
      type: Types.setBackUrl,
      payload: url,
    }
  },
  freedBackUrl: function () {
    return {
      type: Types.freedBackUrl,
    }
  }
}

export default handleActions({
  [Types.setBackUrl]: function (state, { payload }) {
    return state.set('backUrl', payload)
  },
  [Types.freedBackUrl]: function (state) {
    return state.delete('backUrl')
  },
}, initialState)
