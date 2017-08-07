const is = {
  func (v) {
    return typeof v === 'function'
  },
  promise (v) {
    return v && is.func(v.then) && is.func(v.catch)
  },
  string (v) {
    return typeof v === 'string'
  },
}

export default is
