import is from 'util/is'

export default function makeCancelable (promise) {
  if (!is.promise(promise)) {
    return promise
  }
  let _reject
  const next = new Promise(function (resolve, reject) {
    _reject = reject
    // maybe check isCancel to reject
    promise.then(resolve, reject)
  })
  next.cancel = function (message) {
    _reject(createCancel(message || 'Cancel Promise'))
  }
  return next
}

export function copyCancel (target, source) {
  target.cancel = source.cancel
  return target
}

export function createCancel (message) {
  return {
    __CANCEL__: true,
    isCancel: true,
    message,
  }
}
export function cancel (promise, message) {
  if (promise && is.func(promise.cancel)) {
    promise.cancel(message)
  } else if (!__PROD__) {
    console.warn('only call makeCancelable(promise) can cancel')
  }
}
