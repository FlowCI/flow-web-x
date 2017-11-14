import { Component } from 'react'
import PropTypes from 'prop-types'

let originalBodyOverflow = null
let lockingCounter = 0

export default class AutoLockScrolling extends Component {
  static propTypes = {
    lock: PropTypes.bool.isRequired
  }

  static defaultProps = {
    lock: false,
  }

  componentDidMount () {
    if (this.props.lock) {
      this.preventScrolling()
    }
  }

  componentWillReceiveProps (nextProps) {
    const { lock: nextLock } = nextProps
    if (this.props.lock !== nextLock) {
      if (nextLock) {
        this.preventScrolling()
      } else {
        this.allowScrolling()
      }
    }
  }

  componentWillUnmount () {
    this.allowScrolling()
  }

  // force to only lock/unlock once
  locked = false

  preventScrolling () {
    if (this.locked === true) {
      return
    }
    lockingCounter = lockingCounter + 1
    this.locked = true

    // only lock the first time the component is mounted.
    if (lockingCounter === 1) {
      const body = document.getElementsByTagName('body')[0]
      originalBodyOverflow = body.style.overflow
      body.style.overflow = 'hidden'
    }
  }

  allowScrolling () {
    if (this.locked === true) {
      lockingCounter = lockingCounter - 1
      this.locked = false
    }

    if (lockingCounter === 0 && originalBodyOverflow !== null) {
      const body = document.getElementsByTagName('body')[0]
      body.style.overflow = originalBodyOverflow || ''
      originalBodyOverflow = null
    }
  }

  render () {
    return null
  }
}
