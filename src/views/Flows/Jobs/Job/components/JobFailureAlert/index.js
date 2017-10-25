import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import Alert from 'components/Alert'

import classes from './alert.scss'

function mapStateToProps (state, { jobId }) {
  const { job } = state
  return {
    result: job.getIn(['data', jobId, 'failureMessage'])
  }
}

export class JobFailureResult extends Component {
  static propTypes = {
    result: PropTypes.string,
  }

  render () {
    const { result } = this.props
    if (!result) {
      return null
    }
    const message = `失败原因：${result}`
    return <Alert className={classes.alert} message={message}
      closable={false} type='failure' />
  }
}
export default connect(mapStateToProps)(JobFailureResult)
