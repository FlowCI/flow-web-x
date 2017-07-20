import makeCancelable, { copyCancel } from './promiseCancelable'
import HttpProvider from './network'
import isCancel from './isCancel'

export default function (config = {}) {
  const http = new HttpProvider(config).$get()
  const HANDLE_TYPE = config.type

  return function ({ dispatch, getState }) {
    return (next) => (action) => {
      const { url, type } = action
      if (!url || (HANDLE_TYPE && type !== HANDLE_TYPE)) {
        return next(action)
      }
      const { name, indicator } = action
      const promiseWithCancel = makeCancelable(http(action))
      let result = promiseWithCancel
      if (name) {
        // dispatch indicators
        dispatch({ type: `${name}/SEND`, indicator: indicator })
        result = promiseWithCancel.then(function (response) {
          const data = response.data
          dispatch({
            type: `${name}/SUCCESS`,
            indicator: indicator,
            payload: data
          })
          return response
        }, function (e) {
          const suffix = isCancel(e) ? '/CANCEL' : '/FAILURE'
          dispatch({
            type: name + suffix,
            indicator: indicator,
            payload: e
          })
          return Promise.reject(e)
        })
        // copy cancel fn to result
        // cancel fn is set promiseWithCancel to reject
        copyCancel(result, promiseWithCancel)
      }
      return result
    }
  }
}
