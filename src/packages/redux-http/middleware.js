import makeCancelable, { copyCancel } from 'packages/promise-cancelable'
import HttpProvider from './network'
import makeIndicator from './indicator'
import isMatch from './match'

export default function (config = {}) {
  const http = new HttpProvider(config).$get()

  return function ({ dispatch, getState }) {
    return (next) => (action) => {
      if (!isMatch(config, action)) {
        return next(action)
      }
      const { name, indicator } = action
      const promiseWithCancel = makeCancelable(http(action))
      let result = promiseWithCancel
      if (name) {
        const indicatorAction = { type: name, indicator }
        result = makeIndicator(dispatch, promiseWithCancel, indicatorAction)
        // copy cancel fn to result
        // cancel fn is set promiseWithCancel to reject
        copyCancel(result, promiseWithCancel)
      }
      return result
    }
  }
}
