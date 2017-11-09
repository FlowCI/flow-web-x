import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { push } from 'react-router-redux'
import { actions } from 'redux/modules/agent'

import DocumentTitle from 'react-document-title'

import Form from './form'

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    create: actions.create,
    redirect: push,
  }, dispatch)
}

export class CreateAgent extends Component {
  static propTypes = {
    create: PropTypes.func.isRequired,
    redirect: PropTypes.func.isRequired,
  }

  handleSbumit = (values) => {
    const { create, redirect } = this.props
    const { zone, name } = values
    return create(zone, name).then(() => {
      redirect('/admin/agents')
    })
  }

  render () {
    return <DocumentTitle title='添加 Agent · 控制台'>
      <Form onSubmit={this.handleSbumit} />
    </DocumentTitle>
  }
}

export default connect(undefined, mapDispatchToProps)(CreateAgent)
