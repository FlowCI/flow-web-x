import React, { Component } from 'react'
import { string, func } from 'prop-types'

import clipboard from 'clipboard'
import ClipboardButton from 'react-clipboard.js'

export const supported = clipboard.isSupported()

export default class ClipboardButtonWrapper extends Component {
  static propTypes = {
    className: string,
    i18n: func.isRequired,
    onSuccess: func,
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
    const { i18n, className, ...other } = this.props
    const { copied } = this.state

    return <ClipboardButton {...other}
      className={`btn ${supported ? className : 'hide'}`}
      onSuccess={this.handleCopySuccess}
    >
      <span>
        {copied && <i className='icon icon-check text-success' />}
        {i18n(copied ? 'copied' : 'copy')}
      </span>
    </ClipboardButton>
  }
}
