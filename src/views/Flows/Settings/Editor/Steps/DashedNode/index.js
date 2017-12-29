import React, { Component } from 'react'
import PropTypes from 'prop-types'

import IconButton from 'components/IconButton'
import Node from '../Node'
import classes from './dashed.scss'

export default class FlowDottedNode extends Component {
  static propTypes = {
    text: PropTypes.string,
    remove: PropTypes.func.isRequired,
  }

  static defaultProps = {
    text: '',
  }

  handleClick = (e) => {
    e.stopPropagation()
  }

  render () {
    const { text, remove } = this.props
    return <Node>
      <span className={classes.dashed} onClick={this.handleClick}>
        {text}&nbsp;
        <IconButton size='sm' className={classes.close}
          onClick={remove}>
          <i className='icon icon-cross' />
        </IconButton>
      </span>
    </Node>
  }
}
