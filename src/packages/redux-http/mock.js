/*
  only use for mock middleware, it will delay to resolve({
   data: aciton.response,
   status: 200,
  })
*/
import makeCancelable, { copyCancel } from 'packages/promise-cancelable'
import makeIndicator from './indicator'
import is from 'util/is'
import isMatch from './match'

function noop () {}

const defaultConfig = {
  database: noop,
  // if set false, when no handle it will call next(action),
  // if true, it will throw an error
  strict: false,
  // if not find handle in database and autoRespond is true, it will this fn
  respond: noop,
  // if set true is will auto repsond every no handle request
  autoRespond: false,
  // after timeout to respond
  respondAfter: 100
}
export default function (c) {
  const config = { ...defaultConfig, ...c }
  const { database, strict, respond, autoRespond, respondAfter } = config

  return function ({ dispatch, getState }) {
    return (next) => (action) => {
      if (!isMatch(config, action)) {
        return next(action)
      }
      const { name } = action
      const responseHandle = database(name) || (autoRespond ? respond : undefined)
      if (!responseHandle) {
        if (strict) {
          throw new Error(`not found an handle with ${name}`)
        }
        return next(action)
      }
      const { transformResponse } = action

      let response = responseHandle(action)
      if (transformResponse) {
        if (is.func(transformResponse)) {
          response = transformResponse(response)
        } else if (is.array(transformResponse)) {
          response = transformResponse.reduce((data, f) => f(data), response)
        }
      }

      const promise = makeCancelable(new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({ status: 200, data: response })
        }, action.respondAfter || respondAfter)
      }))
      let result = promise
      if (name) {
        const indicatorAction = { type: name, indicator: action.indicator }
        result = makeIndicator(dispatch, promise, indicatorAction)
        copyCancel(result, promise)
      }
      return result
    }
  }
}
