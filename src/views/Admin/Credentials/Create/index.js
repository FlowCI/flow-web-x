import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'redux/modules/credential'

import Form from './form'

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    create: actions.create,
  }, dispatch)
}

export class CreateCredentialForm extends Component {
  static propTypes = {
    create: PropTypes.func.isRequired
  }

  handleCreate = (values) => {
    const { create } = this.props
    const { type, name, ...other } = values
    return create(type, name, other)
  }

  render () {
    return <Form onSubmit={this.handleCreate} />
  }
}

export default connect(undefined, mapDispatchToProps)(CreateCredentialForm)
