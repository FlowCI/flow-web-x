import is from './is'
// 临时先存 localStorage
function set (name, value, options) {
  let str
  if (is.object(value)) {
    str = JSON.stringify(value)
  } else if (is.string(value)) {
    str = value
  } else {
    throw new Error(`unabled to storge with ${typeof value}`)
  }
  localStorage.setItem(name, str)
}

function get (name, options) {
  let value = localStorage.getItem(name)
  if (value) {
    try {
      value = JSON.parse(value)
    } catch (e) {}
  }
  return value
}

export default {
  get,
  set,
}
