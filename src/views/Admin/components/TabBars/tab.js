import React, { Component } from 'react'
import { string, node, bool, any, func } from 'prop-types'

import { Li } from 'components/InlineUl'

import classnames from 'classnames'
import classes from './bars.scss'

export default class Tab extends Component {
  static propTypes = {
    text: string.isRequired,
    children: node,
    active: bool,
    value: any,
    onActive: func,
  }

  handleClick = (e) => {
    e.preventDefault()
    const { onActive, value } = this.props
    return onActive && onActive(value)
  }

  render () {
    const { text, children, active } = this.props
    return <Li className={classnames(classes.item, {
      [classes.active]: active,
    })}>
      <a href='#' title={text} onClick={this.handleClick}>
        {text || children}
      </a>
    </Li>
  }
}
