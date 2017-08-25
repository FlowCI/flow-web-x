import { setCancel, createCancelMessage } from 'promise-cancelable'

export default function (taskFn, checkFinishFn, interval = 3000) {
  let _resolve
  let _reject
  const promise = new Promise(function (resolve, reject) {
    _resolve = resolve
    _reject = reject
  })

  let timer
  function run () {
    taskFn().then(function (response) {
      if (checkFinishFn(response)) {
        _resolve(response)
      } else {
        timer = setTimeout(run, interval)
      }
    }).catch(_reject)
  }

  setCancel(promise, function (message) {
    clearTimeout(timer)
    _reject(createCancelMessage(message))
  })
  run()

  return promise
}
