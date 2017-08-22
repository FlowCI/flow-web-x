import makeCancelable, {
  cancel
} from '../promiseCancelable'
import isCancel from '../isCancel'

describe('Promise Cancelable', function () {
  it('should return next promise', function () {
    const promise = new Promise(function (resolve, reject) {
      setTimeout(resolve, 100)
    })
    const promiseCancelable = makeCancelable(promise)
    expect(promise).to.not.equal(promiseCancelable)
    expect(promiseCancelable).to.be.a('promise')
  })

  it('should resolve promise when arg promise resolve and not cancel', function () {
    const spy = sinon.spy()
    const promise = new Promise(function (resolve, reject) {
      resolve()
    })

    const promiseCancelable = makeCancelable(promise.then(spy).then((v) => {
      spy.should.have.been.calledOnce
    }))

    return promiseCancelable.then(spy).then(() => {
      spy.should.have.been.calledTwice
    }).should.be.fulfilled
  })

  it('should reject promise when arg promise reject and not cancel', function () {
    const spy = sinon.spy()
    const promise = new Promise(function (resolve, reject) {
      reject()
    })
    let _resolve
    let _reject
    const nextPromise = new Promise(function (resolve, reject) {
      _resolve = resolve
      _reject = reject
    })

    promise.catch(spy).then(() => {
      _reject() // set reject to nextPromise
      spy.should.have.been.calledOnce
    })


    // must wait promise is done
    const promiseCancelable = makeCancelable(nextPromise)
    return promiseCancelable.catch(spy).then(() => {
      spy.should.have.been.calledTwice
    }).should.be.fulfilled
  })

  it('should reject promise with cancel object when call cancel', function () {
    const spy = sinon.spy()
    const promise = new Promise(function (resolve, reject) {
      setTimeout(resolve, 1000)
    })

    const promiseCancelable = makeCancelable(promise.then(spy))
    const result = promiseCancelable.catch((e) => {
      expect(isCancel(e)).to.be.true
    }).then(() => {
      spy.should.have.not.been.called
    })
    cancel(promiseCancelable)
    return result.should.be.fulfilled
  })
})
