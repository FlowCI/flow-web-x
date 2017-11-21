import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classnames from 'classnames'
import classes from 'rc-theme/radioGroup.scss'
/**
 * @example ./group.example.md
 */
export default class RadioGroup extends Component {
  static propTypes = {
    className: PropTypes.string,
    classNames: PropTypes.object.isRequired,
    children: PropTypes.node,
    value: PropTypes.any,
    /**
     * @param {any} value
     */
    onChange: PropTypes.func,
  }

  static defaultProps = {
    classNames: classes
  }

  isChecked (radio) {
    return radio ? radio.props.value === this.props.value : false
  }

  handleRadioChange = (value) => {
    const { onChange } = this.props
    onChange && onChange(value)
  }

  cloneChild = (child, index) => {
    return React.cloneElement(child, {
      checked: this.isChecked(child),
      onChange: this.handleRadioChange,
    })
  }

  render () {
    const { classNames, className, children } = this.props
    return <div className={classnames(classNames.group, className)}>
      {React.Children.map(children, this.cloneChild)}
    </div>
  }
}
