import { cancel, STATUS } from 'packages/redux-http'
import create from 'packages/redux-http/middleware'
import isCancel from 'packages/redux-http/isCancel'

const middleware = create()
function noop () {}
function getState () {
  return {}
}
describe('Redux Middleware test', function () {
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

  it('should export an middleware function', function () {
    const nextfn = middleware({ dispatch: noop, getState })
    expect(nextfn).to.be.a('function')
    const actionfn = nextfn(noop)
    expect(actionfn).to.be.a('function')
  })

  it('should return next(action) when action is not matched', function () {
    function next () {
      return 'this is next result'
    }

    const result = middleware({ dispatch: noop, getState })(next)({
      type: 'sometype'
    })
    expect(result).to.be.eql('this is next result')

    const middle = create({ type: '@@http/SEND' })
    const hasTypeResult = middle({ dispatch: noop, getState })(next)({
      type: 'sometype',
      url: '/somepath'
    })
    expect(hasTypeResult).to.be.eql('this is next result')
  })

  it('should no call next(action) when action is matched', function () {
    const next = sinon.spy()
    const handler = middleware({ dispatch: noop, getState })(next)
    const result = handler({ url: '/nomatched' })
    next.should.have.not.been.called
    /**
      must return the promise . due to the axios is async to open,send XMLHttpRequest, it will impact next test
    **/
    return result
  })

  describe('middleware config', function () {
    it('extends config option from axios', async function () {
      const middle = create({ baseURL: 'http://api.domain.com' })
      const actionHandler = middle({ dispatch: noop, getState })(noop)
      await actionHandler({
        url: '/somepath'
      })
      const request = getRequest(0)
      const { url } = request
      expect(url).to.equal('http://api.domain.com/somepath')
    })

    describe('match middleware', function () {
      it('should match all has url action if not set config.type', function () {
        const middle = create({})
        const actionHandler = middle({ dispatch: noop, getState })(noop)

        const p = actionHandler({
          url: '/somepath'
        })
        expect(p).to.be.a('promise')

        const p2 = actionHandler({
          url: '/somepath',
          type: 'someType'
        })
        expect(p2).to.be.a('promise')
        return p2
      })

      it('should only match action.type is config.type and has action.url when set config.type', async function () {
        const middle = create({
          type: '@@http/SEND',
        })

        const actionHandler = middle({ dispatch: noop, getState })(noop)
        const p = actionHandler({
          url: '/somepath'
        })
        expect(p).to.be.undefined // not matched

        const p2 = actionHandler({
          url: '/otherpath',
          type: '@@http/SEND',
        })
        expect(p2).to.be.a('promise')
        return p2
      })
    })
  })

  describe('handle action', function () {
    it('result must can cancel', function () {
      _fakeServer.autoRespondAfter = 10000

      const dispatch = sinon.spy()
      const handler = middleware({ dispatch, getState })(noop)
      const promise = handler({ url: '/sompath', name: 'getSomeThing' })

      const p2 = promise.catch((e) => {
        return e // to set resolve
      }).then((e) => {
        expect(isCancel(e)).to.be.true
      })

      setTimeout(() => {
        cancel(promise)
      }, 100)
      return p2.should.be.fulfilled
    })

    describe('disptach indicator action', function () {
      let _dispatch
      let _handler
      beforeEach(() => {
        _dispatch = sinon.spy()
        _handler = middleware({ dispatch: _dispatch, getState })(noop)
      })

      it(`should sync dispatch action with { type: name, status: ${STATUS.send} } before send http request`, function () {
        const promise = _handler({
          url: '/sompath',
          name: 'getSomeThing',
          indicator: {
            key: '1'
          }
        })
        _dispatch.should.have.been.calledWithMatch({
          type: 'getSomeThing',
          status: STATUS.send,
          indicator: { key: '1' }
        })
        return promise
      })

      it(`should dispatch { type: name, status: ${STATUS.success} } on success`, async function () {
        await _handler({
          url: '/sompath',
          name: 'getSomeThing',
          indicator: {
            key: '1'
          }
        })
        _dispatch.should.have.been.calledWithMatch({
          type: 'getSomeThing',
          status: STATUS.success,
          indicator: { key: '1' },
          payload: {
            message: 'this is default response'
          }
        })
      })

      it(`should dispatch { type: name, status: ${STATUS.failure} } on failure`, async function () {

        _fakeServer.respond([400, {
          'Content-Type': 'application/json; charset=utf-8'
        }, JSON.stringify({ message: 'this is default response' })])

        try {
          await _handler({
            url: '/sompath',
            name: 'getSomeThing',
            indicator: {
              key: '1'
            }
          })
          expect(false).to.be.true // must not go here
        } catch (e) {
          _dispatch.should.have.been.calledWithMatch({
            type: 'getSomeThing',
            status: STATUS.failure,
            indicator: { key: '1' },
            payload: {
              response: {
                status: 400,
                data: {
                  message: 'this is default response'
                }
              }
            }
          })
        }
      })

      it(`should dispatch { type: name, status: ${STATUS.cancel} } on cancel`, async function () {
        _fakeServer.autoRespondAfter = 10000

        const handler = middleware({ dispatch: _dispatch, getState })(noop)
        const promise = handler({
          url: '/sompath',
          name: 'getSomeThing',
          indicator: {
            key: '1'
          }
        })

        cancel(promise)

        return promise.catch((e) => {
          return e // to resolve
        }).then((e) => {
          _dispatch.should.have.been.calledWithMatch({
            type: 'getSomeThing',
            status: STATUS.cancel,
            indicator: { key: '1' }
          })
          expect(isCancel(e)).to.be.true
        }).should.be.fulfilled
      })
    })
  })
})
