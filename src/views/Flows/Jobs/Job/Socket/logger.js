import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { contains } from 'react-immutable-proptypes'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Subscriber } from 'packages/socket'

const baseChanel = '/topic/cmd'

/**
 *
 * @param {object} node job node module
 * @param {string} message 日志内容
 */
function log (node, message) {
  console.log(node.get('id'), message)
  return {
    type: 'onmessage'
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    onMessage: log,
  }, dispatch)
}

export class JobLogSubscriber extends Component {
  static propTypes = {
    node: contains({
      cmdId: PropTypes.string.isRequired,
    }).isRequired,
    onMessage: PropTypes.func.isRequired,
  }

  state = {
    chanel: `${baseChanel}/${this.props.node.get('cmdId')}`
  }

  handleMessage = ({ body }) => {
    const { node, onMessage } = this.props
    return onMessage(node, body)
  }

  render () {
    const { chanel } = this.state
    return <Subscriber {...this.props} chanel={chanel}
      onMessage={this.handleMessage} />
  }
}

export default connect(undefined, mapDispatchToProps)(JobLogSubscriber)
