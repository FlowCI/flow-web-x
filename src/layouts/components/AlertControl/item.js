import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import Alert from 'components/Alert'

export default class AlertControlItem extends Component {
  static propTypes = {
    alert: ImmutablePropTypes.map.isRequired,
    close: PropTypes.func.isRequired,
  }

  handleClose = () => {
    const { close, alert } = this.props
    close(alert.get('id'))
  }

  render () {
    const { alert } = this.props
    const type = alert.get('type')
    const message = alert.get('message')
    const options = alert.get('options', {})

    return <Alert closable {...options}
      type={type} message={message}
      onRequestClose={this.handleClose} />
  }
}
