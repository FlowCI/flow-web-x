import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { mount } from 'enzyme'
import autoCancel from '../index'

import httpMiddleware from 'packages/redux-http/mock'
import { isCancel, cancel } from 'packages/promise-cancelable'

function noop () {}
function getState () { return {} }

describe('React Redux Http Promise Cancel Highter-Order Components', function () {
  let _dispatch
  let http
  this.timeout(200000)
  beforeEach(() => {
    _dispatch = sinon.spy()
    http = httpMiddleware({
      autoRespond: true,
      respondAfter: 500,
    })({ dispatch: _dispatch, getState })(noop)
  })

  const query = function () {
    return http({ url: '/querySometh' })
  }

  class TestComponent extends PureComponent {
    static propTypes = {
      query: PropTypes.func.isRequired
    }

    componentDidMount () {
      const { query } = this.props
      this.promise = query()
    }

    render () {
      return <div>
        hello world
      </div>
    }
  }

  it('should cancel promise when componentWillUnmount by default', () => {
    const WrapperComponent = autoCancel([{ funcs: ['query'] }])(TestComponent)

    const querySpy = sinon.spy(query)
    const component = mount(<WrapperComponent query={querySpy} />)
    querySpy.should.have.been.calledOnce

    const comp = component.find(TestComponent)
    const instance = comp.get(0)
    expect(instance.promise).to.be.a('promise')

    setTimeout(() => {
      component.unmount() // must cancel query promise
    }, 100)

    return instance.promise.catch((e) => e).then((e) => {
      expect(isCancel(e)).to.be.true
    }).should.be.fulfilled
  })

  it('support custom cancel function with config.cancel', function () {
    const cancelSpy = sinon.spy(cancel)
    const WrapperComponent = autoCancel({
      funcs: ['query'],
      cancel: cancelSpy
    })(TestComponent)

    const querySpy = sinon.spy(query)
    const component = mount(<WrapperComponent query={querySpy} />)
    querySpy.should.have.been.calledOnce

    const comp = component.find(TestComponent)
    const instance = comp.get(0)
    expect(instance.promise).to.be.a('promise')

    setTimeout(() => {
      component.unmount() // must cancel query promise
    }, 100)

    return instance.promise.catch((e) => e).then((e) => {
      expect(isCancel(e)).to.be.true
      cancelSpy.should.have.been.callOnce
    }).should.be.fulfilled
  })

  it('should support args[0] is object && not array', function () {
    const WrapperComponent = autoCancel({ funcs: ['query'] })(TestComponent)

    const querySpy = sinon.spy(query)
    const component = mount(<WrapperComponent query={querySpy} />)
    querySpy.should.have.been.calledOnce

    const comp = component.find(TestComponent)
    const instance = comp.get(0)
    expect(instance.promise).to.be.a('promise')

    setTimeout(() => {
      component.unmount() // must cancel query promise
    }, 100)

    return instance.promise.catch((e) => e).then((e) => {
      expect(isCancel(e)).to.be.true
    }).should.be.fulfilled
  })

  it('should cancel promise when call next time which trigger is unique', () => {
    const WrapperComponent = autoCancel([{
      funcs: ['query'],
      trigger: 'unique'
    }])(TestComponent)

    const querySpy = sinon.spy(query)
    const component = mount(<WrapperComponent query={querySpy} />)
    querySpy.should.have.been.calledOnce

    const comp = component.find(TestComponent)
    const instance = comp.get(0)
    expect(instance.promise).to.be.a('promise')

    setTimeout(() => {
      instance.props.query() // must cancel prev query promise
      querySpy.should.have.been.calledTwice
    }, 100)

    return instance.promise.catch((e) => e).then((e) => {
      expect(isCancel(e)).to.be.true
    }).should.be.fulfilled
  })

  it('should can getWrappedInstance when withRef is true', function () {
    const WrapperComponent = autoCancel({ funcs: ['query'] }, { withRef: true })(TestComponent)

    const component = mount(<WrapperComponent query={noop} />)

    const instance = component.instance()
    const wrapped = instance.getWrappedInstance()
    expect(wrapped).to.be.an.instanceof(TestComponent)
  })

  it('should call custom cancel when willUnount and option.cancel is func', function () {
    const cancelSpy = sinon.spy(cancel)
    const WrapperComponent = autoCancel([{ funcs: ['query'] }], {
      cancel: cancelSpy
    })(TestComponent)

    const querySpy = sinon.spy(query)
    const component = mount(<WrapperComponent query={querySpy} />)
    querySpy.should.have.been.calledOnce

    const comp = component.find(TestComponent)
    const instance = comp.get(0)
    expect(instance.promise).to.be.a('promise')

    setTimeout(() => {
      component.unmount() // must cancel query promise
    }, 100)

    return instance.promise.catch((e) => e).then((e) => {
      cancelSpy.should.have.been.calledOnce
      expect(isCancel(e)).to.be.true
    }).should.be.fulfilled
  })

  describe('create config', function () {
    class MultiTestComponent extends PureComponent {
      static propTypes = {
        query: PropTypes.func.isRequired,
        search: PropTypes.func.isRequired,
      }

      componentDidMount () {
        const { query, search } = this.props
        this.queryPromise = query()
        this.searchPromise = search()
      }

      render () {
        return <div>
          hello world
        </div>
      }
    }

    function search () {
      return http({
        url: '/someSearchPath'
      })
    }

    it('should support hybrid when has multi config', () => {
      const WrapperComponent = autoCancel([
        { funcs: ['query'] },
        { funcs: ['search'], trigger: 'unique' },
      ])(MultiTestComponent)
      const querySpy = sinon.spy(query)
      const searchSpy = sinon.spy(search)

      const component = mount(<WrapperComponent
        query={querySpy} search={searchSpy} />)

      const comp = component.find(MultiTestComponent)
      const instance = comp.get(0)
      const { props } = instance
      querySpy.should.have.been.calledOnce
      searchSpy.should.have.been.calledOnce

      setTimeout(() => {
        props.search() // call second, it must cancel pre promise
      }, 100)

      instance.searchPromise.catch((e) => e).then((e) => {
        expect(isCancel(e)).to.be.true
        component.unmount()
      })

      return instance.queryPromise.catch((e) => e).then((e) => {
        expect(isCancel(e)).to.be.true
      }).should.be.fulfilled
    })
  })
})