import React, { Component } from 'react'
import { node, string, func } from 'prop-types'

import AlertControl from '../components/AlertControl'
import Socket from './Socket'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'redux/modules/session'

function mapStateToProps (state) {
  const { session } = state
  return {
    token: session.get('token'),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    getUser: actions.getUser,
  }, dispatch)
}

export class CoreLayout extends Component {
  static propTypes = {
    children: node.isRequired,
    token: string,
    getUser: func.isRequired,
  }

  componentDidMount () {
    const { token, getUser } = this.props
    token && getUser(token)
  }

  render () {
    const { children } = this.props
    return <div style={{ height: '100%' }}>
      <AlertControl />
      <Socket>
        {children}
      </Socket>
    </div>
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CoreLayout)
