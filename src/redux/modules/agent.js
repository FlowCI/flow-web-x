import { handleActions } from 'redux-actions'

import { handleHttp } from '../util'

import { fromJS } from 'immutable'

import is from 'util/is'

import Types from './agentType'

const initialState = fromJS({
  list: [],
  ui: {},
  info: {},
})

export function generatorAgentId (agent) {
  return `${agent.zone} - ${agent.name}`
}

const transformResponse = function (data) {
  if (is.array(data)) {
    data.forEach((d) => {
      d.id = generatorAgentId(d)
    })
  }
  return data
}

export const actions = {
  query: function () {
    return {
      url: '/agents',
      name: Types.query,
      transformResponse
    }
  },
  shutdown: function (agent, password) {
    // wait for socket
    return {
      url: '/agents/shutdown',
      method: 'post',
      indicator: {
        id: agent.get('id'),
      },
      params: {
        zone: agent.get('zone'),
        name: agent.get('name'),
        password,
      },
    }
  },
  /**
   * 改方法仅通知 api ，api 无具体返回，内容通过 socket
   * /topic/agent/sysinfo/:zone/:name 频道推送
   */
  getSystemInfo: function (agent) {
    return {
      url: '/agents/sys/info',
      name: Types.getSystemInfo,
      params: {
        zone: agent.get('zone'),
        name: agent.get('name'),
      }
    }
  },
  storeSystemInfo: function (agent /* Map */, system) {
    return {
      type: Types.storeSystemInfo,
      payload: {
        id: agent.get('id'),
        system,
      }
    }
  }
}

export default handleActions({
  [Types.query]: handleHttp('QUERY', {
    success: function (state, { payload }) {
      return state.set('list', fromJS(payload))
    },
  }),
  [Types.freedAll]: function (state) {
    return initialState
  }
}, initialState)
