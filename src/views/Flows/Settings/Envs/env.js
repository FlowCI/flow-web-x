import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classes from './envs.scss'

export default class FlowEnv extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
  }

  render () {
    const { name, value } = this.props
    return <tr className={classes.env}>
      <td>{name}</td>
      <td>{value}</td>
    </tr>
  }
}
