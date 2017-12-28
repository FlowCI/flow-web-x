import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import Card from './Card'
import Node from './Node'

import classnames from 'classnames'
import classes from './steps.scss'

export default class FlowStep extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    actived: PropTypes.bool,
    step: ImmutablePropTypes.map.isRequired,
    index: PropTypes.number.isRequired,
    onActive: PropTypes.func.isRequired,
  }

  static defaultProps = {
    type: 'FlowStep',
  }

  handleClick = (e) => {
    const { onActive, step } = this.props
    onActive(e, step)
  }

  render () {
    const {
      index, step, actived,
      onActive, // eslint-disable-line no-unused-vars
      ...other
    } = this.props
    const name = step.get('name')
    return <Node>
      <Card className={classnames(classes.step, {
        [classes.active]: actived,
      })} onClick={this.handleClick}
        index={index} data={{ name }} {...other}>
        {name}
      </Card>
    </Node>
  }
}
