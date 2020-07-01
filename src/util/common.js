export default {
  isObject(value) {
    return value && typeof value === 'object' && value.constructor === Object
  }
}
