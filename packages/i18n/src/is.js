export default {
  undefined (v) {
    return v === undefined
  },

  object (v) {
    return typeof v === 'object'
  },

  string (v) {
    return typeof v === 'string'
  },

  func (v) {
    return typeof v === 'function'
  },
}
