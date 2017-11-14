import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Transition from 'react-transition-group/Transition'

import classes from './collapse.scss'

function noop () {}
function refresh (el) { return el.offsetHeight }
export default class CollapseTransition extends Component {
  static propTypes = {
    children: PropTypes.node,
    delay: PropTypes.number,

    onEnter: PropTypes.func.isRequired,
    onEntering: PropTypes.func.isRequired,
    onEntered: PropTypes.func.isRequired,
    onExit: PropTypes.func.isRequired,
    onExiting: PropTypes.func.isRequired,
    onExited: PropTypes.func.isRequired,
  }

  static defaultProps = {
    delay: 300,
    onEnter: noop,
    onEntering: noop,
    onEntered: noop,
    onExit: noop,
    onExiting: noop,
    onExited: noop,
  }

  handleEnter = () => {
    const el = this.wrapper
    if (el) {
      el.style.transitionDuration = '0ms'
      this.height = el.clientHeight
      el.style.maxHeight = '0px'
      el.style.overflow = 'hidden'
      el.style.opacity = '0'
    }
    this.props.onEnter()
  }

  handleEntering = () => {
    const { delay } = this.props
    const el = this.wrapper
    if (el) {
      el.style.transitionDuration = `${delay}ms`
      refresh(el)
      el.style.maxHeight = `${this.height}px`
      el.style.overflow = 'hidden'
      el.style.opacity = '1'
    }
    this.props.onEntering()
  }

  handleEntered = () => {
    const el = this.wrapper
    if (el) {
      el.style.transitionDuration = '0ms'
      el.style.maxHeight = ''
      el.style.overflow = ''
      el.style.opacity = ''
    }
    this.props.onEntered()
  }

  handleExit = () => {
    const el = this.wrapper
    if (el) {
      el.style.transitionDuration = '0ms'
      el.style.maxHeight = `${el.clientHeight}px`
      el.style.overflow = 'hidden'
      el.style.opacity = '1'
    }
    this.props.onExit()
  }

  handleExiting = () => {
    const { delay } = this.props
    const el = this.wrapper
    if (el) {
      refresh(el)
      el.style.transitionDuration = `${delay}ms`
      el.style.maxHeight = '0px'
      el.style.overflow = 'hidden'
      el.style.opacity = '0'
    }
    this.props.onExiting()
  }

  handleExited = () => {
    const el = this.wrapper
    if (el) {
      el.style.transitionDuration = '0ms'
      el.style.maxHeight = ''
      el.style.overflow = ''
      el.style.opacity = ''
    }
    this.props.onExited()
  }

  render () {
    const { children, delay, ...other } = this.props
    return <Transition {...other}
      timeout={delay + 10}
      onEnter={this.handleEnter}
      onEntering={this.handleEntering}
      onEntered={this.handleEntered}
      onExit={this.handleExit}
      onExiting={this.handleExiting}
      onExited={this.handleExited}
    >
      <div className={classes.wrapper}
        ref={(el) => { this.wrapper = el }}>
        {children}
      </div>
    </Transition>
  }
}
