import React, { Component } from 'react'
import { node } from 'prop-types'

import Navbar from './Navbar'

import classes from './AdminLayout.scss'

export default class AdminLayout extends Component {
  static propTypes = {
    children: node,
  }

  render () {
    const { children } = this.props
    return <div className={classes.container}>
      <Navbar />
      {children}
    </div>
  }
}
