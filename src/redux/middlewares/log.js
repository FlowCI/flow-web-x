import is from 'util/is'
import { isCancel } from 'packages/promise-cancelable'
import { actions } from 'redux/modules/alert'
export default function ({ dispatch, getState }) {
  return (next) => (action) => {
    const r = next(action)
    if (is.promise(r)) {
      r.catch((e) => {
        if (!isCancel(e)) {
          console.error(e)
          const { response } = e
          if (response) {
            const { data: { message } } = response
            dispatch(actions.failure(message))
          }
        }
      })
    }
    return r
  }
}
