import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classnames from 'classnames'

import classes from './editor.scss'

export default class CodeEditor extends Component {
  static propTypes = {
    defaultValue: PropTypes.string,
    className: PropTypes.string,
  }

  static defaultProps = {
    defaultValue: ''
  }

  state = {
    value: this.props.defaultValue,
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.defaultValue !== nextProps.defaultValue) {
      this.setState({ value: nextProps.defaultValue })
    }
  }

  handleChange = (e) => {
    this.setState({ value: e.target.value })
  }

  render () {
    const {
      className,
      defaultValue,
      ...other
    } = this.props
    const { value } = this.state
    return <textarea {...other} value={value}
      onChange={this.handleChange}
      className={classnames(classes.editor, className)} />
  }
}
