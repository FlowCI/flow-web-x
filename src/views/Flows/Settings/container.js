import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions as uiActions } from 'redux/modules/ui'
import DocumentTitle from 'react-document-title'

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    setBackUrl: uiActions.setBackUrl,
    freedBackUrl: uiActions.freedBackUrl
  }, dispatch)
}

export class FlowSettingsContainer extends Component {
  static propTypes = {
    params: PropTypes.shape({
      flowId: PropTypes.string.isRequired,
    }).isRequired,
    children: PropTypes.node,
    setBackUrl: PropTypes.func.isRequired,
    freedBackUrl: PropTypes.func.isRequired,
  }

  componentDidMount () {
    const { setBackUrl, params: { flowId } } = this.props
    setBackUrl(`/flows/${flowId}`)
  }

  componentWillUnmount () {
    const { freedBackUrl } = this.props
    freedBackUrl()
  }

  render () {
    const { children, params: { flowId } } = this.props
    return <DocumentTitle title={`${flowId} 工作流设置`}>
      {children}
    </DocumentTitle>
  }
}
export default connect(undefined, mapDispatchToProps)(FlowSettingsContainer)
