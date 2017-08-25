import React, { Component } from 'react'
import toProps from '../index'
import { mount } from 'enzyme'

class TestComponent extends Component {
  render () {
    return <button onClick={this.props.onClick}>this is only test</button>
  }
}

describe('Promise To Props', function () {
  let _resolve
  let _reject
  let onClick

  beforeEach(() => {
    onClick = function () {
      return new Promise(function (resolve, reject) {
        _resolve = resolve
        _reject = reject
      })
    }
  })

  afterEach(() => {
    _resolve = _reject = undefined
  })

  it('should do nothing when component.props include that key', function () {
    const Comp = toProps({ onClick: 'loading' })(TestComponent)

    const comp = mount(<Comp onClick={onClick} loading={undefined} />)
    const testComp = comp.find(TestComponent)
    const props = testComp.props()

    const clickFn = props.onClick

    expect(clickFn).to.be.a('function')
    expect(props.loading).to.be.undefined

    const result = clickFn()
    // update
    comp.update()
    const nextProps = testComp.props()
    expect(nextProps, 'nextProps must not equal to props').to.not.equal(props)
    expect(result).to.be.a('promise')
    expect(nextProps.loading).to.be.undefined
    _resolve(0)
  })

  it('should do nothing when func result isnot promise', function () {
    const noop = function () {}
    const Comp = toProps({ onClick: 'loading' })(TestComponent)

    const comp = mount(<Comp onClick={noop} />)
    const testComp = comp.find(TestComponent)
    const props = testComp.props()
    const clickFn = props.onClick

    expect(clickFn).to.be.a('function')
    expect(props.loading).to.be.undefined

    const result = clickFn()
    // update
    comp.update()
    const nextProps = testComp.props()
    expect(nextProps, 'nextProps must not equal to props').to.not.equal(props)
    expect(nextProps.loading, 'must do nothing').to.be.undefined
  })

  it('set prop to true when promise is not finish, and to false when finish', function () {
    const Comp = toProps({ onClick: 'loading' })(TestComponent)

    const comp = mount(<Comp onClick={onClick} />)
    const testComp = comp.find(TestComponent)
    const props = testComp.props()

    const clickFn = props.onClick

    expect(props.loading).to.be.a('undefined')

    const result = clickFn()
    // update
    comp.update()
    let nextProps = testComp.props()
    expect(nextProps, 'nextProps must not equal to props').to.not.equal(props)
    expect(nextProps.loading, 'must set loading to true').to.be.true
    _resolve(0)

    return result.then(() => {
      nextProps = comp.find(TestComponent).props()
      expect(nextProps.loading, 'must set loading to false').to.be.false
    })
  })
})