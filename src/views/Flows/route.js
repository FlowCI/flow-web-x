import { injectReducer } from 'redux/reducers'

import Component, { reducers } from './index'

export default function (store) {
  return {
    getComponent: function (state, callback) {
      injectReducer(store, reducers)
      callback(null, Component)
    }
  }
}
