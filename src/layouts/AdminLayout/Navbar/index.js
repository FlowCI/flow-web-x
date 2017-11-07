import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { Link } from 'react-router'

import Navbar from '../../components/Navbar'
import classes from './navbar.scss'

function mapStateToProps (state, props) {
  const { session } = state
  return {
    username: session.getIn(['user', 'username'], ''),
  }
}

export class AdminLayoutNavbar extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
  }

  render () {
    const { username } = this.props
    return <Navbar>
      <div className={classes.content}>
        <Link className={classes.card} to='/'>
          <i className='icon icon-branches' />
        </Link>
        <div className={classes.user}>
          管理员 {username}
        </div>
      </div>
    </Navbar>
  }
}

export default connect(mapStateToProps)(AdminLayoutNavbar)
