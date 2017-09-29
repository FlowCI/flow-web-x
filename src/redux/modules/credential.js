import { handleActions } from 'redux-actions'
import { fromJS } from 'immutable'

import { handleHttp } from '../util'

import types from './credentialType'

import is from 'util/is'

/**
 *
 * @param {string} type 证书类型，目前只有 RSA, IOS
 * @param {string} name 证书名称
 * @param {object} extendParams 扩展字段，目前只有 IOS 使用,
 * * 包括 p12s: [{ file, password }], mobileprovisions: [file]
 */
function formatCreateParams (type, name, extendParams) {
  if (type === 'IOS') {
    const { p12s, mobileprovisions } = extendParams
    const f = new FormData()
    const ps = []
    p12s.forEach((d) => {
      const { password, file } = d
      const filename = file.name
      ps.push({ name: filename, password })
      f.append('p12-files', file)
    })
    mobileprovisions.forEach((file) => {
      f.append('pp-files', file)
    })
    f.append('detail', JSON.stringify({
      type,
      p12s: ps,
    }))
    return f
  }
  return { type, name }
}

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
  create: function (type, name, extendParams) {
    const params = formatCreateParams(type, name, extendParams)
    return {
      name: types.create,
      url: `/credentials/${name}`,
      method: 'post',
      data: params,
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
