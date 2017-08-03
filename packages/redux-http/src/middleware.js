import makeCancelable, { copyCancel } from './promiseCancelable'
import HttpProvider from './network'
import makeIndicator from './indicator'

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
        const action = { type: name, indicator }
        result = makeIndicator(dispatch, promiseWithCancel, action)
        // copy cancel fn to result
        // cancel fn is set promiseWithCancel to reject
        copyCancel(result, promiseWithCancel)
      }
      return result
    }
  }
}
