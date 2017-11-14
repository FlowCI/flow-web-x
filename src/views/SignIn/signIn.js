import React, { Component } from 'react'
import PropTypes from 'prop-types'

import createI18n from './i18n'
import language from 'util/language'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { push } from 'react-router-redux'

import { actions } from 'redux/modules/session'

import Form from './form'

import classes from './signIn.scss'

function mapStateToProps (state, props) {
  const { session } = state
  const { location } = props
  return {
    unauthored: !session.get('user'),
    email: location.query.email,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    signIn: actions.signIn,
    redirect: push,
  }, dispatch)
}

export class SignIn extends Component {
  static propTypes = {
    unauthored: PropTypes.bool,
    email: PropTypes.string,

    classNames: PropTypes.object.isRequired,

    signIn: PropTypes.func.isRequired,
    redirect: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  static defaultProps = {
    classNames: classes,
    i18n: createI18n(language),
  }

  componentDidMount () {
    const { redirect, unauthored } = this.props
    !unauthored && redirect('/')
  }

  componentWillUpdate (nextProps, nextState) {
    const { redirect, unauthored } = nextProps
    !unauthored && redirect('/')
  }

  render () {
    const { i18n, classNames, signIn, email } = this.props

    return <Form i18n={i18n} className={classNames.form}
      initialValues={{ username: email }} onSubmit={signIn} />
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
