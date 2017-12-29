import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classnames from 'classnames'
import classes from './start.scss'
export default class FlowStartNode extends Component {
  static propTypes = {
    actived: PropTypes.bool,
  }

  render () {
    const { actived } = this.props
    return <span className={classnames(classes.start, {
      [classes.active]: actived,
    })} />
  }
}
