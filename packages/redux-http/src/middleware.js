import makeCancelable from './promiseCancelable'
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
      const { name } = action
      const promiseWithCancel = makeCancelable(http(config))
      if (name) {
        // dispatch indicators
        dispatch({ type: `${name}/SEND` })
        promiseWithCancel.then(function (v) {
          dispatch({ type: `${name}/SUCCESS` })
          return v
        }, function (e) {
          const suffix = isCancel(e) ? '/CANCEL' : '/FAILURE'
          dispatch({ type: name + suffix })
          return Promise.reject(e)
        })
      }
      return promiseWithCancel
    }
  }
}
