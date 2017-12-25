import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import Input from 'rc-components/Input'

const mapping = {
  STRING: Input
}

export default class ConfigPluginControl extends Component {
  static propTypes = {
    item: ImmutablePropTypes.map.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  }

  render () {
    const {
      item,
      value,
      onChange,
      ...other,
    } = this.props
    const type = item.get('type')

    const control = mapping[type]
    if (!control) {
      console.error('不能获取到输入控件')
    }
    return React.createElement(control, {
      value,
      onChange,
      ...other,
    })
  }
}
