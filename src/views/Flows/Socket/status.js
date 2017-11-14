import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'redux/modules/job'

import { Subscriber } from 'packages/socket'

const baseChanel = '/topic/job'

function mapStateToProps (state, props) {
  return {}
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    onMessage: actions.saveOrdiscarded,
  }, dispatch)
}

export class JobStatusSubscriber extends Component {
  static propTypes = {
    flowId: PropTypes.string.isRequired,
    onMessage: PropTypes.func.isRequired,
  }

  constructor (props, context) {
    super(props, context)
    const { flowId } = this.props
    this.state = {
      chanel: `${baseChanel}/${flowId}`
    }
  }

  handleMessage = ({ body }) => {
    const { onMessage } = this.props
    return onMessage(JSON.parse(body))
  }

  render () {
    const { chanel } = this.state
    return <Subscriber {...this.props} chanel={chanel}
      onMessage={this.handleMessage} />
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(JobStatusSubscriber)
