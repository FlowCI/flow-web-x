import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classnames from 'classnames'

import EnhancedSwitch from '../internal/EnhancedSwitch'
import classes from 'rc-theme/checkbox.scss'

/**
 * @example ./checkbox.example.md
 */
export default class Checkbox extends Component {
  static propTypes = {
    checked: PropTypes.bool,
    indeterminate: PropTypes.bool,

    value: PropTypes.any,

    className: PropTypes.string,
    classNames: PropTypes.object.isRequired,

    labelPosition: PropTypes.oneOf(['right', 'left']).isRequired,
    label: PropTypes.node,

    type: PropTypes.oneOf(['checkbox', 'radio']).isRequired,

    indeterminateIcon: PropTypes.node.isRequired,
    checkedIcon: PropTypes.node.isRequired,
    unCheckedIcon: PropTypes.node.isRequired,
    /**
     * function (checked, value) { }
     */
    onChange: PropTypes.func,
  }

  static defaultProps = {
    checked: false,
    indeterminate: false,
    classNames: classes,
    type: 'checkbox',
    labelPosition: 'right',
    indeterminateIcon: <i className='icon icon-checkbox-indeterminate' />,
    checkedIcon: <i className='icon icon-checkbox-checked' />,
    unCheckedIcon: <i className='icon icon-checkbox-unchecked' />,
  }

  handleChange = (e) => {
    const { onChange, value } = this.props
    const { checked } = e.target
    onChange && onChange(checked, value)
  }

  render () {
    const {
      checked, value, classNames, indeterminate,
      indeterminateIcon, checkedIcon, unCheckedIcon,
      className, ...other
    } = this.props
    const icon = indeterminate ? indeterminateIcon
      : (checked ? checkedIcon : unCheckedIcon)

    return <EnhancedSwitch {...other}
      checked={indeterminate ? false : checked} icon={icon}
      onChange={this.handleChange} classNames={classNames}
      className={classnames(classNames.wrapper, className, {
        indeterminate,
      })}
    />
  }
}
