import axios from 'axios'
import { errorCommit, newTokenCommit } from './index'
import jwtDecode from 'jwt-decode'
import moment from 'moment'
import code from '../util/code'
import _ from 'lodash'

const url = process.env.VUE_APP_API_URL
const token = process.env.VUE_APP_TOKEN

console.log("flow.ci url:" + url)

window.isRefreshing = false

// config axios default instance
const instance = axios.create({
  baseURL: `${url}`,
  timeout: 10000
})

const tokens = {
  token: token,
  refreshToken: ''
}

let waitingForToken = []

const helper = {

  // default request config
  config: {
    headers: {
      'Content-Type': 'application/json'
    }
  },

  // get attachment file name
  getAttachment: (response) => {
    const cd = response.headers[ 'content-disposition' ]

    if (cd === undefined) {
      return null
    }

    // attachment; filename="demo-#107-init.log"
    let index = cd.indexOf('filename=')

    if (index === -1) {
      return null
    }

    return cd.substring(index + 'filename='.length)
      .replace('"', '')
      .replace('"', '')
  },

  isTokenRefreshRequest: (config) => {
    return config.url === 'auth/refresh'
  },

  isLoginRequest: (config) => {
    return config.url === 'auth/login'
  },

  tokenHasExpired: (token) => {
    let decoded = jwtDecode(token)
    let expAt = moment.unix(decoded.exp)
    return expAt.isBefore(moment())
  }
}

/**
 * Interceptor to handle token expired or missing
 */
instance.interceptors.request.use(
  async (config) => {
    if (helper.isTokenRefreshRequest(config)) {
      return config
    }

    if (helper.isLoginRequest(config)) {
      return config
    }

    if (helper.tokenHasExpired(tokens.token)) {

      // the current request should go into waiting list
      if (window.isRefreshing) {
        return await new Promise((resolve, reject) => {
          // console.log(`URL : ${config.url} waiting`)
          waitingForToken.push((newToken) => {
            config.headers.Token = newToken
            resolve(config)
          })
        })
      }

      // request new token by refresh token
      else {
        window.isRefreshing = true
        let response = await axios.post(`${url}/auth/refresh`, tokens)

        if (response.data.code === code.ok) {
          const newToken = response.data.data.token
          newTokenCommit(newToken, tokens.refreshToken)

          waitingForToken.map(sb => sb(newToken))
          waitingForToken = []
          window.isRefreshing = false

          config.headers.Token = newToken
          return config
        } else {
          errorCommit(code.error.auth, 'Invalid refresh token, should login again')
          window.isRefreshing = false
          return false
        }
      }
    }

    config.headers.Token = tokens.token
    return config
  }
)

/**
 * Interceptor to handle the response data
 */
instance.interceptors.response.use(
  // on response
  (response) => {
    let fileName = helper.getAttachment(response)

    if (fileName) {
      return {
        data: response.data,
        file: fileName
      }
    }

    const apiMsg = response.data

    if (apiMsg.code !== code.ok) {
      return Promise.reject({
        code: apiMsg.code,
        message: apiMsg.message
      })
    }

    return {data: apiMsg.data}
  },

  (error) => {
    errorCommit(code.fatal, '[http:response] ' + error.message)
  }
)

const handleResponse = (r, onSuccess) => {
  if (!r) {
    return
  }

  let {data, file} = r
  file ? onSuccess(data, file) : onSuccess(data)
}

const http = {
  host: url,
  token: token,
  call: instance,
  code: code,

  setTokens: (token, refreshToken) => {
    tokens.token = token
    tokens.refreshToken = refreshToken
  },

  get: (url, onSuccess, params) => {
    const config = _.cloneDeep(helper.config)
    config.params = params

    return instance.get(url, config).then((r) => {
      handleResponse(r, onSuccess)
    })
  },

  post: (url, onSuccess, body, config) => {
    if (!config) {
      config = helper.config
    }
    return instance.post(url, body, config).then((r) => {
      handleResponse(r, onSuccess)
    })
  },

  delete: (url, onSuccess, body) => {
    const config = _.cloneDeep(helper.config)
    if (body) {
      config.data = body
    }
    return instance.delete(url, config).then((r) => {
      handleResponse(r, onSuccess)
    })
  }
}

export default http
