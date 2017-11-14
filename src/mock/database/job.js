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
  },
  result:{
    finishTime: 1505809725,
    logPaths: [],
    exitCode: 1,
    name: 'flow-integration',
    updatedAt: 1505780925,
    order: 4,
    startTime: 1505809719,
    outputs: {
      FLOW_GIT_BRANCH: 'master',
      FLOW_GIT_COMMITER: 'WILL',
      FLOW_STATUS: 'READY',
      FLOW_WORKSPACE: '~/flow-platform/test/id/1/1/3',
      FLOW_GIT_COMMIT_ID: '1234',
      FLOW_VERSION: '1.0.0.0.0',
      FLOW_YML_STATUS: 'FOUND',
      FLOW_GIT_SSH_PRIVATE_KEY: '-----BEGIN RSA PRIVATE KEY-----',
      FLOW_GIT_URL: 'git@github.com: flow-ci-plugin/for-testing.git',
      FLOW_GIT_COMPARE_ID: '1234..12121',
      FLOW_GIT_CHANGELOG: 'test',
      FLOW_GIT_SOURCE: 'UNDEFINED_SSH',
      FLOW_GIT_WEBHOOK: 'http://localhost:8088/hooks/git/flow-integration',
    },
    status: 'FAILURE',
    duration: 5,
    nodeTag: 'FLOW',
    createdAt: 1505780919,
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

const NodeStatus = [
  'PENDING',
  'ENQUEUE',
  'RUNNING',
  'SUCCESS',
  'STOPPED',
  'FAILURE',
  'TIMEOUT',
]

function cloneAndRepeat (obj, size) {
  const array = []
  for (let i = 0; i < size; i++) {
    const status = STATUS[i % STATUS.length]
    array.push({ ...obj, number: i + 1, status })
  }
  return array.reverse()
}

function getJobWithChildrenResult (number) {
  const chilren = NodeStatus.map((s, i) => {
    return {
      duration: 10,
      status: s,
      cmdId: `xxxx-${s}-${i}`,
      outputs: {
        FLOW_ENV_OUT_1: 'xx'
      },
      name: `step${i}`,
      order: i
    }
  })
  return {
    ...job,
    status: number ? STATUS[(number - 1) % STATUS.length] : job.status,
    childrenResult: chilren,
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
