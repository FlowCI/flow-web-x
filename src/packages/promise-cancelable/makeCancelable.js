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
  setCancel(next, function (message) {
    _reject(createCancelMessage(message || 'Cancel Promise'))
  })
  return next
}

export function setCancel (promise, cancel) {
  promise.cancel = cancel
}

export function getCancel (promise) {
  if (promise && promise.cancel) {
    return promise.cancel
  }
  if (!__PROD__) {
    console.error(promise, 'is not support cancel')
  }
  return function () {}
}

export function copyCancel (target, source) {
  target.cancel = getCancel(source)
  return target
}

export function createCancelMessage (message) {
  return {
    __CANCEL__: true,
    isCancel: true,
    message,
  }
}

export function cancel (promise, message) {
  const fn = getCancel(promise)
  fn(message)
}
