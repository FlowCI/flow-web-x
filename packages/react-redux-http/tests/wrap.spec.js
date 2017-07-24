import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { mount } from 'enzyme'
import autoCancel from 'index'

import httpMiddleware, { cancel, isCancel } from 'redux-http'

function noop () {}
function getState () { return {} }

describe('Promise Cancel Highter-Order Components', function () {
  let _fakeServer
  let _dispatch
  let http
  function getRequest (index) {
    return _fakeServer.getRequest(index)
  }

  beforeEach(() => {
    _fakeServer = sinon.fakeServer.create()
    _fakeServer.respond([200, {
      'Content-Type': 'application/json; charset=utf-8'
    }, JSON.stringify({ message: 'this is default response' })])
    _fakeServer.autoRespond = true
    _fakeServer.autoRespondAfter = 1000

    _dispatch = sinon.spy()
    http = httpMiddleware()({ dispatch: _dispatch, getState })(noop)
  })

  afterEach(() => {
    _fakeServer.restore()
  })

  const query = function () {
    return http({ url: '/somepath' })
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
    }, 10)

    return instance.promise.catch((e) => e).then((e) => {
      expect(isCancel(e)).to.be.true
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
    }, 10)

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
    }, 10)

    return instance.promise.catch((e) => e).then((e) => {
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
      }, 10)

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