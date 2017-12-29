import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import Plugin from './plugin'

import classes from './plugins.scss'

export default class FlowPluginList extends Component {
  static propTypes = {
    plugins: ImmutablePropTypes.list.isRequired,

    onSelect: PropTypes.func.isRequired,
  }

  render () {
    const { plugins, onSelect } = this.props
    return <div className={classes.plugins}>
      {plugins.map((plugin) => {
        return <Plugin key={plugin.get('name')} plugin={plugin}
          onSelect={onSelect} />
      })}
    </div>
  }
}
