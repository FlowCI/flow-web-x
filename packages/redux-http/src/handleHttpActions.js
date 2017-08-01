import STATUS from './status'

export default function handleHttpActions (reducers = {}) {
  return function (state, action) {
    const { status } = action
    let handler
    switch (status) {
      case STATUS.failure:
        handler = reducers.failure
        break
      case STATUS.cancel:
        handler = reducers.cancel
        break
      case STATUS.send:
        handler = reducers.send
        break
      case STATUS.success:
        handler = reducers.success
        break
    }
    return handler ? handler(state, action) : state
  }
}
