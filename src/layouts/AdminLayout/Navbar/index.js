import React, { Component } from 'react'

import { Link } from 'react-router'

import Navbar from '../../components/Navbar'
import classes from './navbar.scss'

export default class AdminNavbar extends Component {
  render () {
    return <Navbar>
      <div className={classes.content}>
        <Link className={classes.card} to='/'>
          <i className='icon icon-branches' />
        </Link>
        <div className={classes.user}>
          管理员 FLOWYU
        </div>
      </div>
    </Navbar>
  }
}
