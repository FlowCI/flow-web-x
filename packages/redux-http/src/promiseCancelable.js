function isFunction (v) {
  return typeof v === 'function'
}

export function isPromise (v) {
  // return v instanceOf Promise
  return !!v && isFunction(v.then) && isFunction(v.catch)
}

export default function makeCancelable (promise) {
  if (!isPromise(promise)) {
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

export function createCancel (message) {
  return {
    __CANCEL__: true,
    isCancel: true,
    message,
  }
}
export function cancel (promise, message) {
  if (promise && isFunction(promise.cancel)) {
    promise.cancel(message)
  } else if (!__PROD__) {
    console.warn('only call makeCancelable(promise) can cancel')
  }
}
