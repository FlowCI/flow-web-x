import { handleActions } from 'redux-actions'

import { handleHttp } from '../util'

import { fromJS } from 'immutable'

import is from 'util/is'

import Types from './agentType'
import jobTypes from './jobType'

const initialState = fromJS({
  list: [],
  ui: {},
})

const transformResponse = function (data) {
  if (is.array(data)) {
    data.forEach((d) => {
      d.id = d.zoneWithName
    })
  } else if (is.object(data)) {
    data.id = data.zoneWithName
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
  close: function (agent) {
    return {
      url: '/agents/close',
      method: 'post',
      name: Types.close,
      indicator: {
        id: agent.get('id'),
      },
      params: {
        zone: agent.get('zone'),
        name: agent.get('name'),
      },
    }
  },
  remove: function (agent) {
    return {
      url: '/agents/delete',
      method: 'post',
      name: Types.remove,
      indicator: {
        id: agent.get('id'),
      },
      params: {
        zone: agent.get('zone'),
        name: agent.get('name'),
      }
    }
  },
  create: function (zone, name) {
    return {
      url: '/agents/create',
      method: 'post',
      name: Types.create,
      params: {
        zone,
        name,
      },
      transformResponse
    }
  },
  /**
   * 告知 api 获取 agent 信息，具体信息将由通过 socket 推送
   */
  getSystemInfo: function (agent) {
    const name = agent.get('name')
    const zone = agent.get('zone')
    return {
      url: '/agents/sys/info',
      params: {
        name,
        zone,
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
  [Types.close]: handleHttp('CLOSE', {
    success: function (state, { indicator }) {
      // 临时
      const { id } = indicator
      return state.update('list', (list) => {
        const index = list.findIndex((agent) => agent.get('id') === id)
        if (index >= 0) {
          return list.update(index, (agent) => {
            return agent.set('agentStatus', 'OFFLINE')
              .delete('flowName').delete('number') // 关闭可能显示的任务
          })
        }
        return list
      })
    },
  }),
  [Types.remove]: handleHttp('REMOVE', {
    success: function (state, { indicator }) {
      const { id } = indicator
      return state.update('list', (list) => {
        return list.filter((item) => item.get('id') !== id)
      })
    },
  }),
  [Types.create]: handleHttp('CREATE', {
    success: function (state, { payload }) {
      return state.update('list', (list) => list.unshift(fromJS(payload)))
    },
  }),
  [Types.freedAll]: function (state) {
    return initialState
  },

  // job stop
  [jobTypes.stop]: handleHttp('', {
    // 临时
    success: function (state, { indicator }) {
      const { flowId, number } = indicator
      return state.update('list', (list) => {
        const index = list.findIndex((a) => a.get('flowName') === flowId)
        if (index > -1) {
          return list.update(index, (agent) => {
            if (agent.get('number') === number) {
              return agent.delete('flowName').delete('number')
            }
            return agent
          })
        }
        return list
      })
    },
  }),
}, initialState)
