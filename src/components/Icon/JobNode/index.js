import React, { Component } from 'react'
import PropTypes from 'prop-types'

export const STATUS = [
  'PENDING',
  'ENQUEUE',
  'RUNNING',
  'SUCCESS',
  'STOPPED',
  'FAILURE',
  'TIMEOUT',
]

export default class JobNodeIcon extends Component {
  static propTypes = {
    status: PropTypes.oneOf([STATUS]).isRequired,
  }

  render () {
    return <div>

    </div>
  }
}
