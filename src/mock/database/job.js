import types from 'redux/modules/jobType'

const job = {
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

export default {
  [types.query]: function ({ params: { flowName } }) {
    const j = { ...job, nodeName: flowName }
    return cloneAndRepeat(j, 10)
  },
  [types.get]: function ({ params: { flowId, jobId } }) {
    return { ...job, nodeName: flowId, number: jobId }
  },
  [types.queryLastest]: function ({ data: flowNames }) {
    return flowNames.map((name) => Object.assign({}, job, { nodeName: name }))
  },
}
