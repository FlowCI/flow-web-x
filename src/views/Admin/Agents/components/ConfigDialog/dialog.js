import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { map } from 'react-immutable-proptypes'

import _i18n from '../../i18n'
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
    i18n: PropTypes.func.isRequired,
  }

  static defaultProps = {
    i18n: _i18n.createChild('configDialog'),
  }

  render () {
    const { agent, getSystemInfo, i18n } = this.props
    return <Modal title={i18n('title')} {...this.props}>
      <DialogContent i18n={i18n} agent={agent} getSystemInfo={getSystemInfo} />
    </Modal>
  }
}

export default connect(undefined, mapDispatchToProps)(AgentConfigDialog)
