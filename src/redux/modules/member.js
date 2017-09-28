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
  /**
   * params {
   *  email {string}
   *  username {string}
   *  password {string}
   *  isSendEmail {boolTostring}
   *  flows {Array<string>}
   *  roles {Array<string>}
   * }
   */
  create: function (params) {
    return {
      url: '/user/register',
      method: 'post',
      params: {
        ...params,
        flows: {
          arrays: params.flows,
        },
        roles: {
          arrays: params.roles
        }
      },
      name: types.create,
    }
  },
  updateRole: function (emails, role) {
    return {
      url: '/user/role/update',
      method: 'post',
      name: types.updatePermission,
      params: {
        emailList: {
          arrays: emails
        },
        roles: {
          arrays: [role] // 目前只支持一条 role
        }
      },
    }
  },
  updateFlowAuth: function (emails, flowId) {
    return {
      url: '/:flowName/users/auth',
      method: 'post',
      params: {
        arrays: emails,
        flowName: flowId,
      },
      name: types.updatePermission,
    }
  },
  removeAll: function (emails) {
    return {
      url: '/user/delete',
      method: 'post',
      name: types.removeAll,
      params: {
        arrays: emails
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
  // 目前先不接收返回的 member 对象
  [types.create]: handleHttp('CREATE'),
  [types.updateRoles]: handleHttp('UPDATE'),
  [types.removeAll]: handleHttp('', {
    success: function (state, { indicator }) {
      const { emails } = indicator
      // 待定，需要减去 ui 中 total 数
      return handlers.removeAll(state, { payload: emails })
    }
  }),
  [types.freedAll]: function () {
    return initialState
  }
}, initialState)
