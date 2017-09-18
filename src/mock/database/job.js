import types from 'redux/modules/jobType'

const job = {
  'number': 1,
  'status': 'STOPPED',
  'startedAt': 1502266861,
  'finishedAt': 1502266861,
  'createdAt': 1502266861,
  'updatedAt': 1502266878,
  'envs': {
    'FLOW_GIT_COMMIT_ID': 'beccde0305127640974dc96ffdfc490febe0e7bf',
    'FLOW_WORKSPACE': '~/flow-platform/test/id/1/1/3',
    'FLOW_GIT_CHANGELOG': 'Merge branch \'hotfix/artifact\'',
    'FLOW_VERSION': '1.0.0',
    'FLOW_GIT_COMPARE_ID': 'a16b3512e93d...beccde030512',
    'FLOW_GIT_BRANCH': 'master',
    'FLOW_GIT_COMMITER': 'WILL',
  }
}
const STATUS = [
  'CREATED',
  'SESSION_CREATING',
  'RUNNING',
  'SUCCESS',
  'FAILURE',
  'STOPPED',
]

function cloneAndRepeat (obj, size) {
  const array = []
  for (let i = 0; i < size; i++) {
    const status = STATUS[i % STATUS.length]
    array.push({ ...obj, number: i + 1, status })
  }
  return array
}

function getJobWithChildrenResult (number) {
  return {
    ...job,
    status: number ? STATUS[(number - 1) % STATUS.length] : job.status,
    childrenResult: [{
      duration: 0,
      status: 'PENDING',
      cmdId: 'xxx',
      outputs: {
        FLOW_ENV_OUT_1: 'xx'
      },
      name: 'step1',
      order: 0
    }, {
      duration: 0,
      status: 'PENDING',
      cmdId: 'xxx2',
      outputs: {
        FLOW_ENV_OUT_1: 'xx'
      },
      name: 'step2',
      order: 1
    }]
  }
}

export default {
  [types.query]: function ({ params: { flowName } }) {
    const j = { ...job, nodeName: flowName, nodePath: flowName }
    return cloneAndRepeat(j, 10)
  },
  [types.get]: function ({ params: { flowName, jobNumber } }) {
    const j = getJobWithChildrenResult(jobNumber)
    return { ...j, nodeName: flowName, nodePath: flowName, number: jobNumber }
  },
  [types.queryLastest]: function ({ data: flowNames }) {
    return flowNames.map((name) => Object.assign({}, job, {
      nodeName: name,
      nodePath: name
    }))
  },
}
