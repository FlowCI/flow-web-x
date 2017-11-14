import React, { Component } from 'react'
import PropTypes from 'prop-types'

import createI18n from '../i18n'
import language from 'util/language'

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
    i18n: PropTypes.func.isRequired,
  }

  static defaultProps = {
    i18n: createI18n(language).createChild('create'),
  }

  handleCreate = (values) => {
    const { create, redirect } = this.props
    const { type, name, ...other } = values
    return create(type, name, other).then(() => {
      redirect('/admin/credentials')
    })
  }

  render () {
    const { i18n } = this.props
    return <Form onSubmit={this.handleCreate} i18n={i18n} />
  }
}

export default connect(undefined, mapDispatchToProps)(CreateCredentialForm)
