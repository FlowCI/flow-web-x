import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import Card from './Card'
import Node from './Node'

import classnames from 'classnames'
import classes from './plugins.scss'

export default class FlowPlugin extends Component {
  static propTypes = {
    actived: PropTypes.bool,
    plugin: ImmutablePropTypes.map.isRequired,
    index: PropTypes.number.isRequired,
  }

  render () {
    const {
      index, plugin, actived,
      ...other
    } = this.props
    const name = plugin.get('name')
    return <Node>
      <Card className={classnames(classes.plugin, {
        [classes.active]: actived,
      })}
        index={index} data={{ name }} {...other}>
        {name}
      </Card>
    </Node>
  }
}
