/**
 *
 * @param {function} fn
 * @param {number} delay ms
 */
export default function debounce (fn, delay) {
  if (!delay) {
    return fn
  }
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn(...args)
      timer = undefined
    }, delay)
  }
}
