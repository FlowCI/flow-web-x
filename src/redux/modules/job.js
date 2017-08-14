import { handleActions } from 'redux-actions'
import { handleHttp } from 'redux/util'
import { defaultInitState, handlers } from 'redux/handler'

import Types from './jobType'
import FlowTypes from './flowType'

const initialState = defaultInitState

const job = {
  'id': '17080916210140717520056',
  'number': 1,
  'status': 'SUCCESS',
  'startedAt': 1502266861,
  'finishedAt': 1502266861,
  'createdAt': 1502266861,
  'updatedAt': 1502266878,
  'outputs': {
    'FLOW_GIT_COMMIT_ID': {
      desc: '提交的Id',
      value: 'beccde0305127640974dc96ffdfc490febe0e7bf',
    },
    'FLOW_WORKSPACE': {
      desc: '',
      value: '~/flow-platform/test/id/1/1/3',
    },
    'FLOW_GIT_CHANGELOG': {
      desc: '描述的信息',
      value: 'Merge branch \'hotfix/artifact\'',
    },
    'FLOW_VERSION': {
      desc: '',
      value: '1.0.0',
    },
    'FLOW_GIT_COMPARE_ID': {
      desc: '变更对比',
      value: 'a16b3512e93d...beccde030512',
    },
    'FLOW_GIT_BRANCH': {
      desc: '分支',
      value: 'master',
    },
    'FLOW_GIT_COMMITER':{
      desc: '提交者',
      value: 'WILL',
    }
  }
}

function cloneAndRepeat (obj, size) {
  const array = []
  for (let i = 0; i < size; i++) {
    array.push({ ...obj })
  }
  return array
}

function queryAfterLastest (flowId, filter, lastestId) {
  return function ({ getState, dispatch }) {
    const state = getState()
    const job = state.job.getIn(['data', lastestId])
    if (!job) {
      return query(flowId, filter)
    }
    // do something other
  }
}

function query (flowId, filter) {
  return {
    url: '/jobs',
    name: Types.query,
    params: {
      flowName: flowId,
    },
    transformResponse: [function (data) {
      return data.map((d) => {
        d.id = `${d.number}`
        return d
      })
    }],
    response: cloneAndRepeat(job, 10).map((j, i) => {
      j.number = i + 1
      j.id = `jobxxxxx${j.number}`
      return j
    }),
  }
}

export const actions = {
  query: function (flowId, filter, lastestId) {
    const fn = lastestId ? queryAfterLastest : query
    return fn(flowId, filter, lastestId)
  },
  get: function (flowId, jobId) {
    return {
      name: Types.get,
      url: 'jobs/:flow_id/:job_id',
      params: {
        flow_id: flowId,
        job_id: jobId,
      },
      indicator: {
        jobId,
        id: jobId,
      },
      transformResponse: [function (d) {
        d.id = `${d.number}`
        return d
      }],
      response: { ...job, id: jobId },
    }
  },
  setFilter: function (filter) {
    return {
      type: Types.updateFilter,
      payload: filter,
    }
  },
  freedFilter: function () {
    return {
      type: Types.freedFilter,
    }
  }
}

export default handleActions({
  [Types.query]: handleHttp('QUERY', {
    success: handlers.saveAll,
  }),
  [Types.get]: handleHttp('GET', {
    success: handlers.save,
  }),
  [Types.updateFilter]: function (state, { payload }) {
    return state.update('ui', (ui) => ui.set('filter', payload))
  },
  [Types.freedFilter]: function (state) {
    return state.update('ui', (ui) => ui.delete('filter'))
  },
  [FlowTypes.freed]: function (state) {
    return initialState
  }
}, initialState)
