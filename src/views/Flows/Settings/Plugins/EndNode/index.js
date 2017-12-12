import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Node from '../Node'
import classes from './end.scss'

export default class FlowEndNode extends Component {
  static propTypes = {
    onActive: PropTypes.func,
  }

  render () {
    return <Node>
      <span className={classes.end}>
        <i className='icon icon-plus-sm' />
      </span>
    </Node>
  }
}
