import React, { Component } from 'react'
import PropTypes from 'prop-types'

import is from '../../common/is'
import classnames from 'classnames'

export default class EnhancedSwitch extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['checkbox', 'radio']).isRequired,
    checked: PropTypes.bool,
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,

    className: PropTypes.string,
    classNames: PropTypes.object,
    disabled: PropTypes.bool,

    icon: PropTypes.node.isRequired,
    label: PropTypes.node,
    labelPosition: PropTypes.oneOf(['left', 'right']),

    onChange: PropTypes.func,
  }

  static defaultProps = {
    type: 'checkbox',
    component: 'label',
    checked: false,
  }

  getLabel () {
    const { classNames, label, labelPosition } = this.props
    if (!label) {
      return
    }
    const ec = classNames[labelPosition]
    if (is.string(label)) {
      return <span className={ec}>{label}</span>
    }
    return React.cloneElement(label, {
      className: classnames(label.props.className, ec)
    })
  }

  handleChange = (e) => {
    const { onChange } = this.props
    const { checked } = e.target
    onChange && onChange(e, checked)
  }

  render () {
    const {
      icon, labelPosition,
      component, checked, disabled,
      className, type,
    } = this.props
    const label = this.getLabel()

    let left = icon
    let right = label
    if (labelPosition === 'left') {
      left = label
      right = icon
    }

    return React.createElement(component, {
      className: classnames(className, {
        disabled,
        checked,
      })
    }, <input type={type} style={{ display: 'none' }}
      checked={checked} disabled={disabled}
      onChange={this.handleChange} />,
      left, right)
  }
}
