export default {
  isObject(value) {
    return value && typeof value === 'object' && value.constructor === Object
  },

  utf8ToBase64(str) {
    return btoa(unescape(encodeURIComponent(str)))
  },

  base64ToUtf8(str) {
    return decodeURIComponent(escape(atob(str)));
  }
}
