import STATUS from './status'
import isCancel from './isCancel'

export default function makeIndicator (dispatch, promise, action) {
  dispatch({ ...action, status: STATUS.send })

  return promise.then(function (response) {
    const data = response.data
    dispatch({
      ...action,
      status: STATUS.success,
      payload: data
    })
    return response
  }, function (e) {
    const status = isCancel(e) ? 'cancel' : 'failure'
    dispatch({
      ...action,
      status: STATUS[status],
      payload: e
    })
    return Promise.reject(e)
  })
}
