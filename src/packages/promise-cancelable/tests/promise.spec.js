import makeCancelable, {
  cloneCancel,
  cancel,
  isCancel,
} from 'packages/promise-cancelable'

describe('Make Promsie Cancelable', function () {
  it ('should reject an cancel object when promise cancel', () => {
    const cancelSpy = sinon.spy(cancel)

    const promise = new Promise (function (resolve, reject) {
      setTimeout(resolve, 2000)
    })
    const promiseCancelable = makeCancelable(promise)
    setTimeout(function () {
      cancelSpy(promiseCancelable)
    })

    return promiseCancelable.then(() => {
      expect(false).to.be.true // the promise must not resolve
    }, (e) => {
      expect(isCancel(e)).to.be.true
    }).then(() => {
      cancelSpy.should.have.been.calledOnce
    })
  })

  describe('function copyCancel', function () {
    it ('target can cancel source promsie', function () {
      const p1 = makeCancelable(new Promise(function (resolve, reject) {
        setTimeout(resolve, 2000)
      }))
      const p2 = p1.then(() => {
        expect(false).to.be.true // the p1 must be rejected
      })

      cloneCancel(p2, p1)
      cancel(p2) // it will cancel p1

      return p2.then(() => {
        expect(false).to.be.true // the p1 must be rejected
      }).catch((e) => {
        expect(isCancel(e)).to.be.true
      })
    })
  })
})