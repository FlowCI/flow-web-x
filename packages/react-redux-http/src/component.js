import React, { Component } from 'react'
import { isPromise, cancel } from 'redux-http'

import createStore from './store'
import { compose, spy, done } from './util'

/**
  trigger: 'unique', 'unmount', default is unmount
  args support:
    - { funcs: [funcNames], trigger: '' }
    - [{ funcs: [funcNames], trigger: '' }]
  options: {
    withRef: boolean
  }
**/
function getName (Comp) {
  return Comp.displayName || Comp.name
}

export default function createHigherOrderComponent (settings, options) {
  if (typeof settings !== 'object') {
    throw new Error(`settings is type error, it will array or object, but now is ${typeof settings}`)
  }
  if (!Array.isArray(settings)) {
    settings = [settings]
  }
  const { withRef } = options || {}
  return function (WrappedComponent) {
    class AutoCancelWrapper extends Component {
      constructor (props, context) {
        super(props, context)

        this.stores = createStore()
        this.funcs = {}

        settings.forEach(({ funcs, trigger }) => {
          const store = this.stores[trigger || 'unmount']
          if (!store) {
            return console.error('unsupport trigger:', trigger)
          }
          funcs.reduce((fs, name) => {
            fs[name] = this.createFunc(name, trigger, store)
            return fs
          }, this.funcs)
        })
      }

      componentWillUnmount () {
        const keys = Object.keys(this.stores)
        keys.forEach((key) => {
          this.stores[key].destroy()
        })
      }

      getWrappedInstance () {
        return this.wrappedInstance
      }

      createFunc (name, trigger, store) {
        const fn = this.createRunPropsFunc(name)
        const watcher = this.createWatcher(name, store)

        const wrapper = compose(watcher, fn)
        let rs = wrapper
        if (trigger === 'unique') {
          rs = spy(this.createUniqueSpy(name, store), wrapper)
        }
        return rs
      }

      createRunPropsFunc (funcName) {
        return (...args) => {
          const fn = this.props[funcName]
          return fn && fn(...args)
        }
      }

      createWatcher (name, store) {
        return function (result) {
          if (isPromise(result)) {
            store.push(name, result)
            done(result, function () { store.remove(name, result) })
          }
          return result
        }
      }

      createUniqueSpy (name, store) {
        return function () {
          const prev = store.data[name]
          prev && cancel(prev) // it will auto remove on catch
        }
      }

      render () {
        const mergedProps = { ...this.props, ...this.funcs }
        const props = withRef ? {
          ...mergedProps,
          ref: (el) => { this.wrappedInstance = el }
        } : mergedProps
        return React.createElement(WrappedComponent, props)
      }
    }
    AutoCancelWrapper.displayName = `AutoCancelWrapper(${getName(WrappedComponent)})`
    return AutoCancelWrapper
  }
}
