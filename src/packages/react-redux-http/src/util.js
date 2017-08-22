export function spy (...funcs) {
  return function (...args) {
    let result
    funcs.forEach((f) => {
      result = f(...args)
    })
    return result
  }
}

export function compose (...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  const last = funcs[funcs.length - 1]
  const rest = funcs.slice(0, -1)
  return (...args) => rest.reduceRight((composed, f) => f(composed), last(...args))
}

export function done (promise, handle) {
  return promise.then(handle, handle)
}
