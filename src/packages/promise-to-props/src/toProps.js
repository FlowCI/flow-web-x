import React, { Component } from 'react'
import compose from './compose'

function isFunction (v) {
  return typeof v === 'function'
}

export function isPromise (v) {
  // return v instanceOf Promise
  return !!v && isFunction(v.then) && isFunction(v.catch)
}

export default function createHigherOrderComponent (config) {
  return function (WrappedComponent) {
    return class PromiseToProps extends Component {
      state = {

      }

      componentWillMount () {
        this.wrapper()
      }

      componentDidMount () {
        this.isMount = true
        !this.funcs && this.wrapper()
      }

      componentWillUnmount () {
        this.isMount = false
      }

      wrapper () {
        const keys = Object.keys(config)
        this.funcs = keys.reduce((funcs, key) => {
          const name = config[key]
          if (!(name in this.props)) {
            funcs[key] = this.createWrapperFunc(key, name)
          }
          return funcs
        }, {})
      }

      safeSetState (s) {
        if (this.isMount) {
          this.setState(s)
        }
      }

      createSetState (key, value) {
        return () => {
          this.safeSetState({ [key]: value })
        }
      }

      createRunFn (name) {
        return (...args) => {
          const fn = this.props[name]
          return fn && fn(...args)
        }
      }

      createWrapperFunc (name, toPropName) {
        const toProps = (obj) => {
          if (isPromise(obj)) {
            this.safeSetState({ [toPropName]: true })

            const then = this.createSetState(toPropName, false)
            obj.then(then, then)
          }
          return obj
        }
        const fn = this.createRunFn(name)
        return compose(toProps, fn)
      }

      render () {
        return React.createElement(WrappedComponent, {
          ...this.props,
          ...this.funcs,
          ...this.state
        })
      }
    }
  }
}
