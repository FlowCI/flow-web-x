import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Map } from 'immutable'

import { connect } from 'react-redux'

import Steps from '../Steps'

import classes from './container.scss'

function mapStateToProps (state, props) {
  const { flow } = state
  const { params: { flowId } } = props
  const f = flow.getIn(['data', flowId], new Map())
  return {
    flowId,
    git: f.getIn(['envs', 'FLOW_GIT_URL'], ''),
    name: f.get('name', ''),
  }
}

export class FlowEditorContainer extends Component {
  static propTypes = {
    flowId: PropTypes.string.isRequired,
    git: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    children: PropTypes.node,
  }

  render () {
    const { flowId, git, name, children } = this.props
    return <div>
      <div className={classes.panel}>
        <div className={classes.header}>
          <h4 className={classes.title}>{name}</h4>
          <h5 className={classes.subTitle}>{git}</h5>
        </div>
        <Steps flowId={flowId} />
      </div>
      {children}
    </div>
  }
}
export default connect(mapStateToProps)(FlowEditorContainer)
