const is = {
  undefined (v) {
    return v === undefined
  },

  func (v) {
    return typeof v === 'function'
  },
  promise (v) {
    return v && is.func(v.then) && is.func(v.catch)
  },
  string (v) {
    return typeof v === 'string'
  },
  object (v) {
    return typeof v === 'object'
  },
  array: Array.isArray,
  formData (f) {
    return f instanceof FormData
  }
}

export function setIsType (name, checkFn) {
  if (!is[name]) {
    is[name] = checkFn
  } else {
    console.error('it\'s already set up with name: ', name)
  }
  return is
}

export default is
