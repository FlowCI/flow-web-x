import { handleActions } from 'redux-actions'
import { handleHttp } from 'redux/util'
import { defaultInitState, handlers } from 'redux/handler'

import Types from './jobType'
import FlowTypes from './flowType'

const initialState = defaultInitState

const job = {
  'id': '17080916210140717520056',
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

export const actions = {
  query: function (flowId, lastest) {
    return {
      url: '/flows/:flow_id/flowId',
      name: Types.query,
      params: {
        flow_id: flowId,
        create_at: lastest ? lastest.create_at : undefined, // 用于分页
      },
      response: cloneAndRepeat(job, 10).map((j, i) => {
        j.id = `jobxxxxx${i}`
        return j
      }),
    }
  },
  get: function (jobId) {
    return {
      name: Types.get,
      url: 'jobs/:job_id',
      params: {
        job_id: jobId,
      },
      indicator: {
        jobId,
        id: jobId,
      },
      response: { ...job, id: jobId },
    }
  },
}

export default handleActions({
  [Types.query]: handleHttp('QUERY', {
    success: handlers.saveAll,
  }),
  [Types.get]: handleHttp('GET', {
    success: handlers.save,
  }),
  [FlowTypes.freed]: function (state) {
    return initialState
  }
}, initialState)
