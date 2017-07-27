import is from 'util/is'

export const INVALID = 'ACCESSTOKEN/INVALID' // maybe import form type

function isRelative (url) {
  // must begin with /
  return /^\/\w+/.test(url)
}

export default function ({ dispatch, getState }) {
  return (next) => (action) => {
    const { url } = action
    if (!url || !isRelative(url)) {
      return next(action)
    }
    let injectAccessToken = false

    /**
      should add Access-Control-Allow-Headers: 'library, accessToken'
      when CORS
    **/
    const headers = {
      library: 'web'
    }

    const { accessToken } = getState()
    if (accessToken) {
      headers.accessToken = accessToken
      injectAccessToken = true
    }
    const nextAction = {
      ...action,
      headers: { ...action.headers, ...headers }
    }

    const result = next(nextAction)
    if (injectAccessToken && is.promise(result)) {
      result.catch(function (e) {
        if (e && e.status === 401) {
          dispatch({ type: INVALID })
        }
      })
    }
    return result
  }
}
