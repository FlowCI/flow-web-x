// # pending buffered delivered running success failure stopped
function createIsInclude (array) {
  const f = function (status) {
    if (!status) {
      return false
    }
    return array.includes(status)
  }
  f.not = function (status) {
    return status ? !f(status) : false
  }
  return f
}
const pending = createIsInclude(['PENDING', 'ENQUEUE'])
/**
 * 慎用次方法来判断后续是否还有，因为可能是允许失败的 node
 */
const finish = createIsInclude(['SUCCESS', 'STOPPED', 'FAILURE', 'TIMEOUT'])
const stop = createIsInclude(['STOPPED'])

const log = function (status) {
  return !pending(status) && !stop(status)
}

export const is = {
  pending,
  finish,
  stop,
}

export const has = {
  log
}
