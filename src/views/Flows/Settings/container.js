import React, { Component } from 'react'
import PropTypes from 'prop-types'

import DocumentTitle from 'react-document-title'

export default class FlowSettingsContainer extends Component {
  static propTypes = {
    params: PropTypes.shape({
      flowId: PropTypes.string.isRequired,
    }).isRequired,
    children: PropTypes.node,
  }

  render () {
    const { children, params: { flowId } } = this.props
    return <DocumentTitle title={`${flowId} 工作流设置`}>
      {children}
    </DocumentTitle>
  }
}
