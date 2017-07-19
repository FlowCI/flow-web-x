import makeCancelable, {
  isPromise,
  cancel
} from 'promiseCancelable'
import isCancel from 'isCancel'

describe('Promise Cancelable', function () {
  it('should return next promise', function () {
    const promise = new Promise(function (resolve, reject) {
      setTimeout(resolve, 100)
    })
    const promiseCancelable = makeCancelable(promise)
    expect(promise).to.not.equal(promiseCancelable)
  })

  it('should resolve promise when arg promise resolve and not cancel', function () {
    const spy = sinon.spy()
    const promise = new Promise(function (resolve, reject) {
      resolve()
    })
    promise.then(spy).then((v) => {
      spy.should.have.been.calledOnce
      return v
    })

    const promiseCancelable = makeCancelable(promise)
    promiseCancelable.then(spy).then(() => {
      spy.should.have.been.calledTwice
    })
    return promiseCancelable.should.be.fulfilled
  })

  it('should reject promise when arg promise reject and not cancel', function () {
    const spy = sinon.spy()
    const promise = new Promise(function (resolve, reject) {
      reject()
    })
    function onCatch(e) {
      spy(e)
      return Promise.reject(e)
    }
    promise.catch(onCatch).catch((e) => {
      spy.should.have.been.calledOnce
      return Promise.reject(e)
    })

    const promiseCancelable = makeCancelable(promise)
    promiseCancelable.catch(onCatch).catch((e) => {
      spy.should.have.been.calledTwice
      return Promise.reject(e)
    })
    return promiseCancelable.should.be.rejected
  })

  it('should reject promise with cancel object when call cancel', function () {
    const spy = sinon.spy()
    const promise = new Promise(function (resolve, reject) {
      setTimeout(resolve, 1000)
    })
    promise.then(spy) // should not call before it finish
    const promiseCancelable = makeCancelable(promise)
    promiseCancelable.then(() => {
      expect(false).to.be.true
    }).catch((e) => {
      spy.should.have.not.been.called
      expect(isCancel(e)).to.be.true
      return Promise.reject(e)
    })
    promiseCancelable.cancel()
    return promiseCancelable.should.be.rejected
  })
  it('should reject promise with cancel object when call cancel', function () {
    const spy = sinon.spy()
    const promise = new Promise(function (resolve, reject) {
      setTimeout(resolve, 1000)
    })
    promise.then(spy) // should not call before it finish
    const promiseCancelable = makeCancelable(promise)
    promiseCancelable.then(() => {
      expect(false).to.be.true
    }).catch((e) => {
      spy.should.have.not.been.called
      expect(isCancel(e)).to.be.true
      return Promise.reject(e)
    })
    cancel(promiseCancelable)
    return promiseCancelable.should.be.rejected
  })
})
