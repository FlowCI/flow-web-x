import { handleActions } from 'redux-actions'

import { handleHttp } from '../util'
import { defaultInitState, createHandlers } from 'redux/handler'

import types from './memberType'

const initialState = defaultInitState
const handlers = createHandlers({ id: 'email' })

export const actions = {
  query: function (page, pageSize, order, search) {
    return {
      name: types.query,
      url: '/user',
      params: {
        page,
        pageSize,
        order,
        search,
      },
      indicator: {
        page,
        pageSize,
        order,
      }
    }
  },
  removeAll: function (emails) {
    return {
      url: '/user',
      method: 'post',
      name: types.removeAll,
      params: {
        emailList: emails
      },
      indicator: {
        emails,
      }
    }
  },
  freedAll: function () {
    return {
      type: types.freedAll,
    }
  }
}
// { list: [[page1], [page2], [page3]], data: {} }
export default handleActions({
  [types.query]: handleHttp('QUERY', {
    success: function (state, { indicator, payload }) {
      const { total, adminCount, users } = payload
      const { page } = indicator

      // 如果是第一页,则直接替换 state
      const s = page === 1 ? initialState : state
      const pureUsers = users.map((user) => {
        return {
          ...user,
          flows: undefined,
          roles: undefined
        }
      })
      return handlers.saveAll(s, { payload: pureUsers }).update('ui', (ui) => {
        return ui.merge({ total, adminCount, page })
      })
    }
  }),
  [types.removeAll]: handleHttp('', {
    success: function (state, { indicator }) {
      // 待定，需要减去 ui 中 total 数
      return handlers.removeAll(state, { payload: indicator })
    }
  }),
  [types.freedAll]: function () {
    return initialState
  }
}, initialState)
