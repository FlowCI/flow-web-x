import React, { Component } from 'react'
import PropTypes from 'prop-types'

export const STATUS = [
  'CREATED',
  'SESSION_CREATING',
  'RUNNING',
  'FAILURE',
  'ERROR',
  'STOPPED',
]

export default class JobIcon extends Component {
  static propTypes = {
    status: PropTypes.oneOf([STATUS]).isRequired,
  }

  render () {
    return <div>

    </div>
  }
}
