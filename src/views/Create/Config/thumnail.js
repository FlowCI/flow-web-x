import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import classes from './thumnail.scss'

function mapStateToProps (state, { params: { flowId } }) {
  const { flow } = state
  return {
    git: flow.getIn(['data', flowId, 'envs', 'FLOW_GIT_URL'], '')
  }
}

export class CreateFlowThumnail extends Component {
  static propTypes = {
    git: PropTypes.string.isRequired,
  }

  render () {
    const { git } = this.props
    return <div className={classes.thumnail}>
      <span className={classes.icon}>
        <i className='icon icon-equalizer' />
      </span>
      <h4 className={classes.wrapper}>
        {git}
      </h4>
    </div>
  }
}

export default connect(mapStateToProps)(CreateFlowThumnail)
