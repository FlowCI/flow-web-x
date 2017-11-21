import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classnames from 'classnames'
import classes from 'rc-theme/checkboxGroup.scss'
/**
 * @example ./group.example.md
 */
export default class CheckboxGroup extends Component {
  static propTypes = {
    className: PropTypes.string,
    classNames: PropTypes.object.isRequired,
    children: PropTypes.node,
    value: PropTypes.array.isRequired,
    /**
     * function (values, checkboxValue) { }
     * @param {array} values: 操作之后的 value 值
     * @param {any} checkboxValue: 点击 checkbox 组件的 value 值
     */
    onChange: PropTypes.func,
  }

  static defaultProps = {
    value: [],
    classNames: classes
  }

  isChecked (checkbox) {
    if (!checkbox) {
      return false
    }
    const { value } = this.props
    const v = checkbox.props.value
    return v !== undefined && v !== null && value.includes(v)
  }

  handleCheckboxChange = (checked, value) => {
    const { value: values, onChange } = this.props
    let nextValues = []
    if (checked) {
      nextValues = [...values, value]
    } else {
      nextValues = values.filter((v) => v !== value)
    }
    onChange && onChange(nextValues, value)
  }

  cloneChild = (child, index) => {
    return React.cloneElement(child, {
      checked: this.isChecked(child),
      onChange: this.handleCheckboxChange,
    })
  }

  render () {
    const { classNames, className, children } = this.props
    return <div className={classnames(classNames.group, className)}>
      {React.Children.map(children, this.cloneChild)}
    </div>
  }
}
