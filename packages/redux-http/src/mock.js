/*
  only use for mock middleware, it will delay to resolve({
   data: aciton.response,
   status: 200,
  })
*/
import makeCancelable, { copyCancel } from './promiseCancelable'
import makeIndicator from './indicator'

export default function (config = {}) {
  const HANDLE_TYPE = config.type
  return function ({ dispatch, getState }) {
    return (next) => (action) => {
      const { mock, url, type } = action
      if (!mock || !url || (HANDLE_TYPE && type !== HANDLE_TYPE)) {
        return next(action)
      }

      const {
        name, indicator,
        delay, transformResponse, response
      } = action

      const promise = makeCancelable(new Promise((resolve, reject) => {
        setTimeout(() => {
          let result = response
          if (transformResponse) {
            result = transformResponse.reduce((data, f) => f(data), result)
          }
          resolve({ status: 200, data: result })
        }, delay || 100)
      }))
      let result = promise
      if (name) {
        const indicatorAction = { type: name, indicator }
        result = makeIndicator(dispatch, promise, indicatorAction)
        copyCancel(result, promise)
      }
      return result
    }
  }
}
