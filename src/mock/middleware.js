import httpMockMiddleware from 'redux-http/src/mock'
import find from './find'

export default function (config) {
  return httpMockMiddleware({ ...config, database: find })
}
