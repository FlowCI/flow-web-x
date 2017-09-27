import React, { Component } from 'react'
import PropTypes from 'prop-types'

import clipboard from 'clipboard'
import ClipboardButton from 'react-clipboard.js'

export const supported = clipboard.isSupported()

export default class ClipboardButtonWrapper extends Component {
  static propTypes = {
    /**
     * @param {string} data-clipboard-text 要复制的内容
     */
    className: PropTypes.string,
    size: PropTypes.oneOf(['sm', 'lg']),
    i18n: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
  }

  static defaultProps = {
    className: '',
    i18n: function (n) { return n },
  }

  state = {}

  componentWillUnmount () {
    this.copyTimer && clearTimeout(this.copyTimer)
  }

  handleCopySuccess = (e) => {
    this.setState({ copied: true })
    this.copyTimer = setTimeout(() => {
      this.setState({ copied: false })
    }, 3000)
    const { onSuccess } = this.props
    return onSuccess && onSuccess(e)
  }

  render () {
    const { i18n, className, size, ...other } = this.props
    const { copied } = this.state

    const cls = ['btn']
    cls.push(supported ? className : 'hide')
    size && cls.push(`btn-${size}`)

    return <ClipboardButton {...other}
      className={cls.join(' ')}
      onSuccess={this.handleCopySuccess}
    >
      <span>
        {copied && <i className='icon icon-check text-success' />}
        {i18n(copied ? 'copied' : 'copy')}
      </span>
    </ClipboardButton>
  }
}
