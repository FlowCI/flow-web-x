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
}

export default is
