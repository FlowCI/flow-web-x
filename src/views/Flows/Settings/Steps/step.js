import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import Card from './Card'
import Node from './Node'

import classnames from 'classnames'
import classes from './steps.scss'

export default class FlowStep extends Component {
  static propTypes = {
    actived: PropTypes.bool,
    step: ImmutablePropTypes.map.isRequired,
    index: PropTypes.number.isRequired,
  }

  render () {
    const {
      index, step, actived,
      ...other
    } = this.props
    const name = step.get('name')
    return <Node>
      <Card className={classnames(classes.step, {
        [classes.active]: actived,
      })}
        index={index} data={{ name }} {...other}>
        {name}
      </Card>
    </Node>
  }
}
