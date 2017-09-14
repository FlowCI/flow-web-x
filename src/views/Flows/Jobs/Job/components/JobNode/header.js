import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Arrow from 'components/Arrow'

import classes from './header.scss'

export default class JobNodeHeader extends Component {
  static propTypes = {
    expended: PropTypes.bool,
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    onClick: PropTypes.func,
  }

  render () {
    const { expended, status, name, onClick } = this.props
    const cls = [classes.header]
    expended && cls.push(classes.expended)
    status && cls.push(classes[status])
    return <h5 className={cls.join(' ')} onClick={onClick}>
      <span><i className={`icon icon-check ${classes.icon}`} />{name}</span>
      <Arrow up={expended} />
    </h5>
  }
}
