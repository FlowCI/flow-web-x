import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classnames from 'classnames'

import classes from './editor.scss'

export default class CodeEditor extends Component {
  static propTypes = {
    className: PropTypes.string,
  }

  render () {
    const {
      className,
    } = this.props
    return <textarea {...this.props}
      className={classnames(classes.editor, className)} />
  }
}
