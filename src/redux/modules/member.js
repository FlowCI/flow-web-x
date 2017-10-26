import { handleActions } from 'redux-actions'
import { Map } from 'immutable'

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
      url: '/flows/:flowName/users/auth',
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
  },
  setFilter: function (filter) {
    return {
      type: types.setFilter,
      payload: filter
    }
  },
  freedFilter: function () {
    return {
      type: types.freedFilter
    }
  }
}
// { list: [[page1], [page2], [page3]], data: {} }
export default handleActions({
  [types.query]: handleHttp('QUERY', {
    success: function (state, { indicator, payload }) {
      // 暂时不考虑分页
      const { users } = payload
      const pureUsers = users.map((user) => {
        return {
          ...user,
          flows: undefined,
          roles: undefined
        }
      })
      return handlers.saveAll(initialState, { payload: pureUsers })
    }
  }),
  // 目前先不接收返回的 member 对象
  [types.create]: handleHttp('CREATE'),
  [types.updateRoles]: handleHttp('UPDATE'),
  [types.removeAll]: handleHttp('', {
    success: function (state, { indicator }) {
      const { emails } = indicator
      return handlers.removeAll(state, { payload: emails })
    }
  }),

  // ui
  [types.setFilter]: function (state, { payload }) {
    return state.updateIn(['ui', 'filter'], (filter) => filter
      ? filter.merge(payload) : new Map(payload))
  },
  [types.freedFilter]: function (state) {
    return state.updateIn(['ui', 'filter'], () => new Map())
  },
  [types.freedAll]: function () {
    return initialState
  }
}, initialState)
