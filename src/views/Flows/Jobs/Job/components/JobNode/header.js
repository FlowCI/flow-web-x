import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { has } from 'util/nodeStatus'

import Arrow from 'components/Arrow'
import NodeIcon from 'components/Icon/Node'

import classes from './header.scss'

export default class JobNodeHeader extends Component {
  static propTypes = {
    expended: PropTypes.bool,
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    toggle: PropTypes.func,
  }

  handleClick = () => {
    const { toggle } = this.props
    toggle && toggle()
  }

  render () {
    const { expended, status, name } = this.props

    const cls = [classes.header]
    expended && cls.push(classes.expended)

    const disabled = !has.log(status)

    if (disabled) {
      cls.push(classes.disabled)
    } else {
      classes[status] && cls.push(classes[status])
    }
    const onClick = !disabled ? this.handleClick : undefined

    return <h5 className={cls.join(' ')} onClick={onClick}>
      <span>
        <NodeIcon status={status} className={classes.icon} />
        {name}
      </span>
      <Arrow up={expended} />
    </h5>
  }
}
