import handleHttpActions from '../handleHttpActions'
import STATUS from '../status'

describe('Redux Http handleHttpActions', function () {
  it('should do nothing when no handler', function () {
    const state = {}
    const reducer = handleHttpActions({})
    const nextState = reducer(state, { type: 'someType', status: STATUS.send })
    expect(state).to.be.equal(nextState)
  })

  it('should be call reducers.send when http status is send', function () {
    const spy = sinon.spy()
    const reducer = handleHttpActions({ send: spy })
    reducer({}, { type: 'someType', status: STATUS.send })
    spy.should.have.been.calledOnce
  })

  it('should be call reducers.success when http status is success', function () {
    const spy = sinon.spy()
    const reducer = handleHttpActions({ success: spy })
    reducer({}, { type: 'someType', status: STATUS.success })
    spy.should.have.been.calledOnce
  })

  it('should be call reducers.failure when http status is failure', function () {
    const spy = sinon.spy()
    const reducer = handleHttpActions({ failure: spy })
    reducer({}, { type: 'someType', status: STATUS.failure })
    spy.should.have.been.calledOnce
  })

  it('should be call reducers.cancel when http status is cancel', function () {
    const spy = sinon.spy()
    const reducer = handleHttpActions({ cancel: spy })
    reducer({}, { type: 'someType', status: STATUS.cancel })
    spy.should.have.been.calledOnce
  })
})
