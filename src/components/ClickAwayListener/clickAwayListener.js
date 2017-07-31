import { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'

const isDescendant = (el, target) => {
  if (target !== null) {
    return el === target || isDescendant(el, target.parentNode)
  }
  return false
}

const clickAwayEvents = ['mouseup', 'touchend']
const bind = (callback) => clickAwayEvents.forEach((event) => {
  window.addEventListener(event, callback)
})
const unbind = (callback) => clickAwayEvents.forEach((event) => {
  window.removeEventListener(event, callback)
})

export default class ClickAwayListener extends Component {
  static propTypes = {
    children: PropTypes.node,
    onClickAway: PropTypes.any
  }

  componentDidMount () {
    this._isMount = true
    if (this.props.onClickAway) {
      // 防止上一次事件触发 handleClickAway
      setTimeout(() => bind(this.handleClickAway), 0)
    }
  }

  componentDidUpdate (prevProps) {
    const { onClickAway: preOnClickAway } = prevProps
    const { onClickAway } = this.props
    if (preOnClickAway !== onClickAway) {
      preOnClickAway && unbind(this.handleClickAway)
      if (onClickAway) {
        setTimeout(() => bind(this.handleClickAway), 0)
      }
    }
  }

  componentWillUnmount () {
    this._isMount = false
    unbind(this.handleClickAway)
  }

  // when onClickAway is undefined, is must no call
  handleClickAway = (event) => {
    if (event.defaultPrevented) {
      return
    }
    // IE11 support, which trigger the handleClickAway even after the unbind
    if (this._isMount) {
      const el = ReactDOM.findDOMNode(this)
      const { target } = event
      if (document.documentElement.contains(target) &&
        !isDescendant(el, target)
      ) {
        this.props.onClickAway(event)
      }
    }
  }

  render () {
    return this.props.children
  }
}
