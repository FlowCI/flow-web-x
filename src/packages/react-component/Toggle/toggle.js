import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classnames from 'classnames'
import classes from 'rc-theme/toggle.scss'

/**
 * @example ./toggle.example.md
 */
export default class Toggle extends Component {
  static propTypes = {
    onLabel: PropTypes.string,
    offLabel: PropTypes.string,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,

    size: PropTypes.oneOf(['sm']),
    className: PropTypes.string,
    classNames: PropTypes.object.isRequired,
    /**
     * @param {bool} checked
     */
    onChange: PropTypes.func,
  }

  static defaultProps = {
    onLabel: '开',
    offLabel: '关',
    classNames: classes,
  }

  handleClick = (e) => {
    const { disabled, checked, onChange } = this.props
    if (disabled) {
      return
    }
    onChange && onChange(!checked)
  }

  render () {
    const {
      onLabel, offLabel,
      classNames, className,
      size, disabled, checked,
    } = this.props
    return <span
      className={classnames(classNames.toggle, className, {
        checked, disabled,
      },
      classNames[size])}
      onClick={this.handleClick}>
      <span className={classNames.label}>
        {checked ? onLabel : offLabel}
      </span>
      <i className={classNames.dot} />
    </span>
  }
}
