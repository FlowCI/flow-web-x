import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { push } from 'react-router-redux'
import { actions } from 'redux/modules/credential'

import Form from './form'

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    create: actions.create,
    redirect: push,
  }, dispatch)
}

export class CreateCredentialForm extends Component {
  static propTypes = {
    create: PropTypes.func.isRequired,
    redirect: PropTypes.func.isRequired,
  }

  handleCreate = (values) => {
    const { create, redirect } = this.props
    const { type, name, ...other } = values
    return create(type, name, other).then(() => {
      redirect('/admin/credentials')
    })
  }

  render () {
    return <Form onSubmit={this.handleCreate} />
  }
}

export default connect(undefined, mapDispatchToProps)(CreateCredentialForm)
