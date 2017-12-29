import React, { Component } from 'react'

import classes from './connector.scss'
export default class PluginConnector extends Component {
  render () {
    return <span className={classes.group}>
      <hr className={classes.line} />
      <span className={classes.arrow} />
    </span>
  }
}
