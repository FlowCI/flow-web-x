import React, { Component } from 'react'
import { node } from 'prop-types'

import { Link } from 'react-router'

import classes from './navbar.scss'

export default class Navbar extends Component {
  static propTypes = {
    children: node,
  }

  render () {
    const { children } = this.props

    return <div className={classes.navbar}>
      <Link className={classes.logo} to='/'>
        <i className='icon icon-logo' />
      </Link>
      {children}
    </div>
  }
}
