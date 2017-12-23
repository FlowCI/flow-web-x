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
