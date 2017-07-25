import resquestHeaders, { INVALID } from 'store/middlewares/headers'

function noop () {}
function intact (action) {
  return action
}
describe('Redux Middlewares Headers', function () {
  let dispatch = noop
  let getState = function () { return {} }

  it('should do nothing when action is not has url', function () {
    const nextHandler = resquestHeaders({ dispatch, getState })
    const actionHandler = nextHandler(intact)

    const action = { type: 'someActionType' }
    const result = actionHandler(action)

    expect(result).to.equal(action)
  })

  it('must auto append field to headers when url is relative', function () {
    const nextHandler = resquestHeaders({ dispatch, getState })
    const actionHandler = nextHandler(intact)

    const action = { type: 'someActionType', url: '/someRelativeUrl' }
    const result = actionHandler(action)

    expect(result).to.eql({
      ...action,
      headers: {
        library: 'web',
      }
    })
  })

  it('must append accessToken to headers when url is relative and state has accessToken', function () {
    getState = function () { return { accessToken: 'someToken' }}
    const nextHandler = resquestHeaders({ dispatch, getState })
    const actionHandler = nextHandler(intact)

    const action = { type: 'someActionType', url: '/someRelativeUrl' }
    const result = actionHandler(action)

    expect(result).to.eql({
      ...action,
      headers: {
        accessToken: 'someToken',
        library: 'web',
      }
    })
  })

  it(`must dispatch type: ${INVALID} when inject accesstoken to header and promise catch with status 401`, async function () {
    dispatch = sinon.spy()
    getState = function () { return { accessToken: 'someToken' }}
    const nextHandler = resquestHeaders({ dispatch, getState })
    const next = function () {
      return new Promise(function (resolve, reject) {
        setTimeout(() => {
          reject({ status: 401 })
        }, 0) // also can sync
      })
    }
    const actionHandler = nextHandler(next)

    const action = { type: 'someActionType', url: '/someRelativeUrl' }
    const result = actionHandler(action)

    expect(result).to.be.a('promise')

    return result.catch((e) => {
      dispatch.should.have.been.calledWith({ type: INVALID })
    })
  })
})
