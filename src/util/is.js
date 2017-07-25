const is = {
  func (v) {
    return typeof v === 'function'
  },
  promise (v) {
    return v && is.func(v.then) && is.func(v.catch)
  },
}

export default is
