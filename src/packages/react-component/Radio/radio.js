import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Checkbox from '../Checkbox'

import classnames from 'classnames'
import classes from 'rc-theme/radio.scss'
/**
 * @example ./radio.example.md
 */
export default class Radio extends Component {
  static propTypes = {
    className: PropTypes.string,
    checkedIcon: PropTypes.node.isRequired,
    unCheckedIcon: PropTypes.node.isRequired,
    /**
     * function (value) { }
     */
    onChange: PropTypes.func
  }

  static defaultProps = {
    checkedIcon: <i className='icon icon-radio-checked' />,
    unCheckedIcon: <i className='icon icon-radio-unchecked' />,
  }

  /**
   * checked will always true
   */
  hanleChange = (checked, value) => {
    const { onChange } = this.props
    onChange && onChange(value)
  }

  render () {
    const { className } = this.props
    return <Checkbox {...this.props} indeterminate={false}
      type='radio' onChange={this.hanleChange}
      className={classnames(classes.radio, className)} />
  }
}
