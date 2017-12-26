import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Input from 'rc-components/Input'

const mapping = {
  STRING: Input
}
export default class ConfigPluginControl extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    /**
     * 目前未使用
     */
    values: PropTypes.array,
    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    value: ''
  }

  handleChange = (value) => {
    const { name, onChange } = this.props
    onChange(name, value)
  }

  render () {
    const {
      type,
      value,
      name, // eslint-disable-line no-unused-vars
      values, // eslint-disable-line no-unused-vars
      ...other,
    } = this.props

    const control = mapping[type]
    if (!control) {
      console.error('不能获取到输入控件')
    }
    return React.createElement(control, {
      size: 'lg',
      ...other,
      value,
      onChange: this.handleChange,
    })
  }
}
