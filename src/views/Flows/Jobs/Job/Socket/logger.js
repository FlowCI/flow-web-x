import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { contains } from 'react-immutable-proptypes'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { is } from 'util/nodeStatus'

import { actions } from 'redux/modules/node'

import { Subscriber } from 'packages/socket'

const baseChanel = '/topic/cmd'

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    onMessage: actions.storeLog,
  }, dispatch)
}

export class JobLogSubscriber extends Component {
  static propTypes = {
    node: contains({
      cmdId: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    }).isRequired,
    onMessage: PropTypes.func.isRequired,
  }

  state = {
    chanel: `${baseChanel}/${this.props.node.get('cmdId')}`
  }

  handleMessage = ({ body }) => {
    const { node, onMessage } = this.props
    try {
      // 由于特殊字符及后端推送 context-type 为 text，所以此处为 # 隔断
      const index = body.indexOf('#')
      const number = parseInt(body.substr(0, index))
      const content = body.substr(index + 1)
      const obj = { number, content }
      return onMessage(node, obj)
    } catch (e) {}
  }

  render () {
    const { node } = this.props
    const { chanel } = this.state
    const status = node.get('status')
    return <Subscriber {...this.props} chanel={chanel}
      onMessage={this.handleMessage} disabled={is.finish(status)} />
  }
}

export default connect(undefined, mapDispatchToProps)(JobLogSubscriber)
