import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import classes from './thumnail.scss'

function mapStateToProps (state, { params: { flowId, git } }) {
  return {
    flowId,
    git,
  }
}

export class CreateFlowThumnail extends Component {
  static propTypes = {
    flowId: PropTypes.string.isRequired,
    // git: PropTypes.string,
  }

  render () {
    const { flowId } = this.props
    return <div className={classes.thumnail}>
      <span className={classes.icon}>
        <i className='icon icon-equalizer' />
      </span>
      <h4 className={classes.wrapper}>
        {flowId}
      </h4>
    </div>
  }
}

export default connect(mapStateToProps)(CreateFlowThumnail)
