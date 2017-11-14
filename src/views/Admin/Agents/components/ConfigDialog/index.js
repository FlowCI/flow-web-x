import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { map } from 'react-immutable-proptypes'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'redux/modules/agent'

import { Modal } from 'components/Modal'

import DialogContent from './content'

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    getSystemInfo: actions.getSystemInfo,
  }, dispatch)
}

export class AgentConfigDialog extends Component {
  static propTypes = {
    agent: map,
    getSystemInfo: PropTypes.func.isRequired,
  }

  render () {
    const { agent, getSystemInfo } = this.props
    return <Modal title='环境信息' {...this.props}>
      <DialogContent agent={agent} getSystemInfo={getSystemInfo} />
    </Modal>
  }
}

export default connect(undefined, mapDispatchToProps)(AgentConfigDialog)
