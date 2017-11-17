import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classnames from 'classnames'

import classes from './form.scss'

export default class FormItem extends Component {
  static propTypes = {
    label: PropTypes.node,
    classNames: PropTypes.object.isRequired,
    children: PropTypes.node,
  }

  static defaultProps = {
    classNames: {}
  }

  render () {
    const {
      label, children, classNames
    } = this.props
    return <div className={classnames(classes.item, classNames.item)}>
      <div className={classnames(classes.label, classNames.label)}>
        {label}
      </div>
      <div className={classnames(classes.control, classNames.control)}>
        {children}
      </div>
    </div>
  }
}
