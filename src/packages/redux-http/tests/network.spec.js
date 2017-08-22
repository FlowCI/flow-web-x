import HttpProvider from '../network'
const http = new HttpProvider().$get()
// const http = httpClient.request.bind(httpClient)

describe('network module', function () {
  let _fakeServer

  function getRequest (index) {
    const { requests } = _fakeServer
    return requests[index]
  }

  beforeEach(() => {
    _fakeServer = sinon.fakeServer.create()
    _fakeServer.respond([200, {
      'Content-Type': 'application/json; charset=utf-8'
    }, JSON.stringify({ message: 'this is default response' })])
    _fakeServer.autoRespond = true
  })

  afterEach(() => {
    _fakeServer.restore()
  })

  it('should extends axios config. etc baseURL', async function () {
    const provider = new HttpProvider({
      baseURL: 'http://api.some.domain'
    })
    const http = provider.$get()
    await http({
      url: '/somepath',
      method: 'get',
    })
    const request = getRequest(0)
    const { url } = request
    expect(url).to.equal('http://api.some.domain/somepath')
  })

  ;['post', 'put', 'patch'].forEach((method) => {
    it(`should merge data and params when method is ${method}`, async function () {
      await http({
        url: '/some',
        method,
        data: {
          a: '1',
          b: '2',
        },
        params: {
          a: '11',
          c: '3',
        }
      })
      const request = getRequest(0)
      const data = JSON.parse(request.requestBody)
      expect(data).to.eql({
        a: '11',
        b: '2',
        c: '3'
      })
    })
  })

  it('should replace params when url has :params', async function () {
    await http({
      url: '/some/:path',
      method: 'get',
      params: {
        path: 'somepath',
        other: 'queryParams',
      }
    })
    const request = getRequest(0)
    const { url } = request
    expect(url).to.equal('/some/somepath?other=queryParams')
  })
  it('should throw an error when url has :params and no set in params', function () {
    const fnWithParamsIsUndeinfed = () => {
      http({
        url: '/some/:path',
        method: 'get',
      })
    }
    expect(fnWithParamsIsUndeinfed).to.throws(Error)

    const fnWithParamsIsNoValue = () => {
      http({
        url: '/some/:path',
        method: 'get',
        data: {
          path: 'xxx',
        },
        params: {
          other: 'xxx'
        },
      })
    }
    expect(fnWithParamsIsNoValue).to.throws(Error)
  })
})
