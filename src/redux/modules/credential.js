import { handleActions } from 'redux-actions'
import { fromJS } from 'immutable'

import { handleHttp } from '../util'

import types from './credentialType'

import is from 'util/is'

export const actions = {
  query: function (type) {
    return {
      url: '/credentials',
      name: types.query,
      params: {
        types: type, /** 目前只支持 1个 type */
      },
      transformResponse: function (data) {
        if (is.array(data)) {
          return data.reduce((d, item) => {
            const type = item.type
            const array = d[type] || []
            array.push(item)
            d[type] = array
            return d
          }, {})
        }
      }
    }
  },
  create: function (type, name) {
    return {
      name: types.create,
      url: '/credentials/:name',
      method: 'post',
      params: {
        type,
        name,
      }
    }
  },
  freedAll: function () {
    return {
      type: types.freedAll,
    }
  }
}

const initialState = fromJS({
  RSA: [],
  IOS: [],
  ui: {},
})

export default handleActions({
  [types.query]: handleHttp('QUERY', {
    success: function (state, { payload }) {
      const keys = Object.keys(payload)
      let nextState = state
      keys.forEach((key) => {
        const array = payload[key]
        nextState = nextState.update(key, () => fromJS(array))
      })
      return nextState
    }
  }),
  [types.create]: handleHttp('CREATE', {
    success: function (state, { payload }) {
      const { type } = payload
      return state.update(type, (old) => old ? old.push(fromJS(payload))
        : fromJS([payload]))
    }
  }),
  [types.freedAll]: function () {
    return initialState
  }
}, initialState)
