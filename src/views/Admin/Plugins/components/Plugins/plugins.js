import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classes from './plugin.scss'

export default class PluginList extends Component {
  static propTypes = {
    children: PropTypes.node,
    i18n: PropTypes.func.isRequired,
  }

  render () {
    const { children, i18n } = this.props
    return <div className={classes.plugins}>
      <div className={classes.header}>
        <div className={classes.icon}>{' '}</div>
        <div className={classes.plugin}>
          {i18n('plugin')}
        </div>
        <div className={classes.desc}>
          {i18n('desc')}
        </div>
      </div>
      <div className={classes.body}>
        {children}
      </div>
    </div>
  }
}
