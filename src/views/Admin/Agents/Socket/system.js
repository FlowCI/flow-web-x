import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { contains } from 'react-immutable-proptypes'

import { Subscriber } from 'packages/socket'

const baseChanel = '/topic/agent/sysinfo/'

export default class AgentSystemSubscriber extends Component {
  static propTypes = {
    agent: contains({
      zone: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    onMessage: PropTypes.func.isRequired,
  }

  state = {
    chanel: `${baseChanel}/${this.props.agent.get('zone')}/${this.props.agent.get('name')}`
  }

  handleMessage = ({ body }) => {
    const { agent, onMessage } = this.props
    let obj = body
    try {
      obj = JSON.parse(body)
    } catch (e) {}
    return onMessage(agent, obj)
  }

  render () {
    const { chanel } = this.state
    return <Subscriber {...this.props} chanel={chanel}
      onMessage={this.handleMessage} />
  }
}
