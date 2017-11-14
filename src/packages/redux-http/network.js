import { Axios } from 'axios'
import defaults from 'axios/lib/defaults'
import is from 'util/is'

function getConfig (url, config) {
  // merge in config, not immutable
  const conf = is.string(url) ? { ...(config || {}), url } : url
  return conf
}

function buildURL (url, params = {}) {
  const r = /:([a-zA-Z]\w*)/g
  const match = url.match(r)
  match && match.forEach((i) => {
    const m = i.substr(1)
    const v = params[m]
    if (v === undefined) {
      throw new Error(`unfind url params, ${url}`)
    }
    url = url.replace(i, v)
    params[m] = undefined
  })
  return url
}

export default class HttpProvider extends Axios {
  request (url, config) {
    const conf = getConfig(url, config)
    conf.url = buildURL(conf.url, conf.params)
    if (conf.params && ['post', 'put', 'patch'].includes(conf.method)) {
      conf.data = { ...conf.data, ...conf.params }
      conf.params = undefined
    }
    if (is.string(conf.data)) {
      const headers = conf.headers || {}
      if (!headers['Content-Type']) {
        // 如果不设置默认 data 为 string 时 content-type 会由浏览器设置，会导致问题
        headers['Content-Type'] = 'text/plain;charset=UTF-8'
        conf.headers = headers
      }
    }
    const { transformResponse, transformRequest } = conf
    if (transformResponse && is.func(transformResponse)) {
      conf.transformResponse = [
        ...defaults.transformResponse,
        transformResponse
      ]
    }
    if (transformRequest && is.func(transformRequest)) {
      conf.transformRequest = [
        ...defaults.transformRequest,
        transformRequest
      ]
    }
    return super.request(conf)
  }

  $get () {
    return this.request.bind(this)
  }
}
