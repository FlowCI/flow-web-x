import { handleActions } from 'redux-actions'
import { handleHttp } from '../util'
import { defaultInitState, createHandlers } from 'redux/handler'
import types from './stepType'

const handlers = createHandlers({ id: 'name' })
const initState = defaultInitState

function getStepsWrapper (fn) {
  return function (...args) {
    return function (dispatch, getState) {
      const { step } = getState()
      return dispatch(fn(step, ...args))
    }
  }
}

function updateStep (steps, flowId, step) {
  const nextSteps = steps.updateIn(['data', step.get('name')], () => step)
  const data = nextSteps.get('data')
  const list = nextSteps.get('list').map((id) => data.get(id)).toJS()
  return actions.update(flowId, list)
}

function removeStep (steps, flowId, stepName) {
  const names = steps.get('list').filter((name) => name !== stepName)
  const data = steps.get('data')
  const list = names.map((name) => data.get(name)).toJS()
  return actions.update(flowId, list)
}

function createIncreasingName (name, index, check) {
  index = index || 0
  const nextName = index ? `${name}${index}` : name
  if (check(nextName)) {
    return nextName
  }
  return createIncreasingName(name, index + 1, check)
}

function checkRepeat (list, name) {
  return !list.includes(name)
}

function addCustomStep (steps, flowId, name, script) {
  const list = steps.get('list')
  const data = steps.get('data')

  const checkName = (name) => {
    return checkRepeat(list, name)
  }
  const saveName = createIncreasingName(name, 0, checkName)
  const saveSteps = list.map((id) => data.get(id)).toJS()
  saveSteps.push({ name: saveName, script })
  return actions.update(flowId, saveSteps)
}

function addPlugin (steps, flowId, plugin, envs) {
  const list = steps.get('list')
  const data = steps.get('data')
  const stepName = plugin.get('name')

  const checkName = (name) => {
    return checkRepeat(list, name)
  }

  const saveName = createIncreasingName(stepName, 0, checkName)
  const saveSteps = list.map((id) => data.get(id)).toJS()

  saveSteps.push({ name: saveName, plugin: stepName, envs })
  return actions.update(flowId, saveSteps)
}
export const actions = {
  query (flowId) {
    return {
      url: '/flows/:flowName/steps',
      name: types.query,
      params: {
        flowName: flowId,
      }
    }
  },
  update (flowId, steps) {
    return {
      url: `/flows/${flowId}/steps`,
      method: 'post',
      data: steps,
      name: types.update,
    }
  },
  updateStep: getStepsWrapper(updateStep),
  removeStep: getStepsWrapper(removeStep),
  addCustomStep: getStepsWrapper(addCustomStep),
  addPlugin: getStepsWrapper(addPlugin),
  freed () {
    return {
      type: types.freed,
    }
  }
}

export default handleActions({
  [types.query]: handleHttp('QUERY', {
    success: handlers.saveAll
  }),
  [types.update]: handleHttp('QUERY', {
    success: function (state, action) {
      const ns = initState.set('ui', state.get('ui'))
      return handlers.saveAll(ns, action)
    }
  }),
  [types.freed]: function () {
    return initState
  }
}, initState)
