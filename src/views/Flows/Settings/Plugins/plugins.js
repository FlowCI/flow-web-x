import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import Plugin from './plugin'

import classes from './plugins.scss'

export default class FlowPlugins extends Component {
  static propTypes = {
    plugins: ImmutablePropTypes.list.isRequired,
    install: PropTypes.func.isRequired,
  }

  render () {
    const { plugins, install } = this.props
    return <div className={classes.plugins}>
      {plugins.map((plugin) => <Plugin key={plugin.get('name')}
        plugin={plugin} install={install} />)}
    </div>
  }
}
