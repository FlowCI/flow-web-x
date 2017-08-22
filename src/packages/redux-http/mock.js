/*
  only use for mock middleware, it will delay to resolve({
   data: aciton.response,
   status: 200,
  })
*/
import makeCancelable, { copyCancel } from './promiseCancelable'
import makeIndicator from './indicator'

function isFunction (v) {
  return typeof v === 'function'
}

export default function (config = {}) {
  const HANDLE_TYPE = config.type
  const { database, all = false } = config
  return function ({ dispatch, getState }) {
    return (next) => (action) => {
      const { name, url, type } = action
      if (!name || !url || (HANDLE_TYPE && type !== HANDLE_TYPE)) {
        return next(action)
      }
      const responseHandle = database(name)
      if (!responseHandle) {
        return all ? console.error('unfound response', action) : next(action)
      }
      const {
        indicator, delay,
        transformResponse
      } = action

      let response = responseHandle(action)
      if (transformResponse) {
        if (isFunction(transformResponse)) {
          response = transformResponse(response)
        } else {
          response = transformResponse.reduce((data, f) => f(data), response)
        }
      }

      const promise = makeCancelable(new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({ status: 200, data: response })
        }, delay || 100)
      }))

      const indicatorAction = { type: name, indicator }
      const result = makeIndicator(dispatch, promise, indicatorAction)

      copyCancel(result, promise)
      return result
    }
  }
}
