import { handleActions } from 'redux-actions'
import { handleHttp } from '../util'
import { defaultInitState, createHandlers } from 'redux/handler'
import types from './pluginType'

import { List, fromJS } from 'immutable'

const handlers = createHandlers({ id: 'name' })
const initState = defaultInitState.set('labels', new List())

export const actions = {
  queryLabels () {
    return {
      url: 'plugins/labels',
      name: types.queryLabels,
    }
  },

  query: function (status, label, keyword) {
    return {
      method: 'post',
      url: '/plugins',
      name: types.query,
      params: {
        status: status ? [status] : undefined,
        labels: label ? [label] : undefined,
        keyword: keyword,
      }
    }
  },

  queryInstalled (keyword) {
    return actions.query('INSTALLED', undefined, keyword)
  },

  install (pluginName) {
    return {
      method: 'post',
      url: '/plugins/install/:name',
      params: {
        name: pluginName,
      },
      name: types.install,
    }
  },

  uninstall (pluginName) {
    return {
      method: 'delete',
      url: '/plugins/uninstall/:name',
      params: {
        name: pluginName,
      },
      name: types.uninstall,
      indicator: {
        name: pluginName
      }
    }
  },

  freed () {
    return {
      type: types.freed,
    }
  }
}

export default handleActions({
  [types.query]: handleHttp('QUERY', {
    success: function (state, action) {
      // replace list and data
      const nextState = state.set('list', initState.get('list'))
        .set('data', initState.get('data'))
      return handlers.saveAll(nextState, action)
    }
  }),
  [types.queryLabels]: handleHttp('QUERY_LABELS', {
    success: function (state, { payload }) {
      return state.update('labels', () => fromJS(payload))
    }
  }),
  [types.install]: handleHttp('INSTALL', {
    success: handlers.save,
  }),
  [types.uninstall]: handleHttp('UNINSTALL', {
    success: function (state, { indicator: { name } }) {
      return handlers.remove(state, { payload: { name } })
    }
  }),
  [types.freed]: function () {
    return initState
  }
}, initState)
