import React, { Component } from 'react'
import { bool, node, func } from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'

import Navbar from './Navbar'

import classes from './AdminLayout.scss'

function mapStateToProps (state, props) {
  const { session } = state
  return {
    isAdmin: session.getIn(['user', 'isAdmin'], false),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    redirect: push,
  }, dispatch)
}

export class AdminLayout extends Component {
  static propTypes = {
    isAdmin: bool,
    children: node,
    redirect: func.isRequired,
  }

  componentDidMount () {
    const { isAdmin, redirect } = this.props
    if (!isAdmin) {
      redirect('/')
    }
  }

  render () {
    const { children } = this.props
    return <div className={classes.container}>
      <Navbar />
      {children}
    </div>
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(AdminLayout)
