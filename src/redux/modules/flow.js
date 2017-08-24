import { handleActions } from 'redux-actions'
import { Map, fromJS } from 'immutable'
import is from 'util/is'

import polling from 'polling'
import { setCancel, cancel } from 'promise-cancelable'

import { handleHttp } from 'redux/util'
import { handleHttpActions } from 'redux-http'
import { defaultInitState, handlers } from 'redux/handler'

import Types from './flowType'
import JobTypes from './jobType'

const initialState = defaultInitState.set('status', new Map())

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

function getYml (flowId) {
  return function (dispatch, getState) {
    function get () {
      return dispatch({
        url: '/flows/:flowName/yml',
        params: {
          flowName: flowId,
        }
      })
    }
    function check (response) {
      return !!response.data
    }
    return polling(get, check)
  }
}

function verifyYml (flowId) {
  function verify (yml) {
    return {
      url: `/flows/${flowId}/yml/verify`,
      name: 'xxx',
      data: yml,
    }
  }
  return function (dispatch) {
    const promise = dispatch(getYml(flowId))
    let p2
    const resultPromise = promise.then((response) => {
      const yml = response.data
      p2 = dispatch(verify(yml))
      return p2
    })
    setCancel(resultPromise, function (message) {
      cancel(promise, message)
      p2 && cancel(p2, message)
    })
    return resultPromise
  }
}

function getCreateEnv ({ source, url }) {
  return {
    FLOW_GIT_SOURCE: source,
    FLOW_GIT_URL: url,
  }
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
      url: '/flows/:flowName/delete',
      method: 'post',
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
  doneCreate: function (flowId, params) {
    return actions.updateEnv(flowId, {
      FLOW_STATUS: 'READY',
      ...getCreateEnv(params)
    })
  },
  doCreateTest: function (flowId, params) {
    return async function (dispatch) {
      await dispatch(actions.updateEnv(flowId, getCreateEnv(params)))
      await dispatch(notifyLoadYml(flowId))
    }
  },
  getCreateTestResult: verifyYml,

  setDropDownFilter: function (filter) {
    return {
      type: Types.setDropDownFilter,
      payload: filter,
    }
  },
  freedDropDownFilter: function () {
    return {
      type: Types.freedDropDownFilter,
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

  // UI
  [Types.setDropDownFilter]: function (state, { payload }) {
    return state.update('ui', (ui) => ui.set('dropDownFilter', payload))
  },
  [Types.freedDropDownFilter]: function (state) {
    return state.update('ui', (ui) => ui.delete('dropDownFilter'))
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
