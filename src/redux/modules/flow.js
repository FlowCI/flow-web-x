import { handleActions } from 'redux-actions'
import { Map, fromJS } from 'immutable'
import is from 'util/is'

import polling from 'polling'

import { handleHttp } from 'redux/util'
import { handleHttpActions } from 'redux-http'
import { defaultInitState, handlers } from 'redux/handler'

import Types from './flowType'
import JobTypes from './jobType'
import { actions as jobActions } from './job'

const initialState = defaultInitState.set('status', new Map())

/**
 * 后端以 name 为 flow 的唯一标识，为统一将 name 值转至 id 字段
 * @param {object or array} data
 */
const transformResponse = function (data) {
  if (is.array(data)) {
    data.forEach((d) => {
      d.id = d.name
    })
  } else if (is.object(data) && data.name) {
    data.id = data.name
  }
  return data
}

function notifyLoadYml (flowId) {
  return {
    url: '/flows/:flowName/yml/load',
    params: {
      flowName: flowId,
    },
    name: Types.loadYml,
    transformResponse,
  }
}

function pollingTestResult (flowId) {
  return function (dispatch, getState) {
    function get () {
      return dispatch({
        url: '/flows/:flowName/env',
        name: Types.pollingEnv,
        params: {
          flowName: flowId,
        },
        indicator: {
          id: flowId,
        }
      })
    }
    function check (response) {
      const envs = response.data
      return envs.FLOW_YML_STATUS === 'FOUND' ||
        envs.FLOW_YML_STATUS === 'ERROR' ||
        envs.FLOW_YML_STATUS === 'NOT_FOUND'
    }
    return polling(get, check)
  }
}

function getCreateEnv (params) {
  const {
    type,
    source, url,
    deploy, username,
    password
  } = params
  const env = {
    FLOW_GIT_SOURCE: source,
    FLOW_GIT_URL: url,
  }
  if (type === 'SSH') {
    env.FLOW_GIT_CREDENTIAL = deploy
  } else if (type === 'HTTP') {
    env.FLOW_GIT_HTTP_USER = username
    env.FLOW_GIT_HTTP_PASS = password
  }
  return env
}

export const actions = {
  query: function () {
    return {
      url: '/flows',
      name: Types.query,
      transformResponse,
    }
  },
  get: function (flowId) {
    return {
      url: '/flows/:flowName',
      name: Types.get,
      transformResponse,
      params: {
        flowName: flowId,
      },
      indicator: {
        id: flowId,
      }
    }
  },
  create: function (flowId) {
    return {
      url: '/flows/:flowName',
      method: 'post',
      name: Types.create,
      params: {
        flowName: flowId,
      },
      indicator: {
        id: flowId,
      },
      transformResponse,
    }
  },
  remove: function (flowId) {
    return {
      url: '/flows/:flowName',
      method: 'delete',
      name: Types.remove,
      params: {
        flowName: flowId,
      },
      indicator: {
        id: flowId,
      },
      transformResponse,
    }
  },
  updateEnv: function (flowId, env) {
    return {
      url: '/flows/:flowName/env',
      name: Types.updateEnv,
      method: 'post',
      params: {
        flowName: flowId,
        ...env,
      },
      indicator: {
        id: flowId,
      },
      transformResponse,
    }
  },
  /**
   * see getCreateEnv params
   */
  doneCreate: function (flowId, params) {
    return function (dispatch) {
      const p = dispatch(actions.updateEnv(flowId, {
        FLOW_STATUS: 'READY',
        ...getCreateEnv(params)
      }))
      p.then(() => {
        // 创建成功后自动创建 job
        dispatch(jobActions.create(flowId, 'master'))
      })
      return p
    }
  },
  doCreateTest: function (flowId, params) {
    return async function (dispatch) {
      await dispatch(actions.updateEnv(flowId, getCreateEnv(params)))
      await dispatch(notifyLoadYml(flowId))
    }
  },
  getTestResult: pollingTestResult,

  setFilter: function (filter) {
    return {
      type: Types.setFilter,
      payload: filter,
    }
  },
  freedFilter: function () {
    return {
      type: Types.freedFilter,
    }
  },
  freed: function (flowId) {
    return {
      type: Types.freed,
      id: flowId,
    }
  },
}

export default handleActions({
  [Types.query]: handleHttp('QUERY', {
    success: handlers.saveAll,
  }),
  [Types.get]: handleHttp('GET', {
    success: handlers.saveData,
  }),
  [Types.create]: handleHttp('GET', {
    success: handlers.save,
  }),
  [Types.remove]: handleHttp('REMOVE', {
    success: handlers.remove,
  }),
  [Types.updateEnv]: handleHttp('UPDATE', {
    success: handlers.saveData,
  }),

  [Types.loadYml]: handleHttpActions({
    success: handlers.saveData,
  }),
  [Types.pollingEnv]: handleHttpActions({
    success: function (state, { indicator: { id }, payload: envs }) {
      return handlers.saveData(state, { payload: { id, envs } })
    },
  }),

  // UI
  [Types.setFilter]: function (state, { payload }) {
    return state.update('ui', (ui) => ui.set('filter', payload))
  },
  [Types.freedFilter]: function (state) {
    return state.update('ui', (ui) => ui.delete('filter'))
  },
  [Types.freedAll]: function (state) {
    return initialState
  },

  // Job Type
  [JobTypes.queryLastest]: handleHttp('QUERY_LAST_JOBS', {
    success: function (state, { payload: jobs }) {
      const f = jobs.reduce((s, job) => {
        s[job.nodeName] = job
        return s
      }, {})
      return state.set('status', fromJS(f))
    }
  }),
}, initialState)
