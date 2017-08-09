import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import createI18n from './i18n'
import language from 'util/language'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'redux/modules/session'

import Form from './form'

import classes from './signin.scss'

function mapStateToProps (state, props) {
  const { session } = state
  const { location } = props
  return {
    unauthored: !session.has('user'),
    email: location.query.email,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    signIn: actions.signIn,
  }, dispatch)
}

export class SignIn extends PureComponent {
  static propTypes = {
    unauthored: PropTypes.bool,
    email: PropTypes.string,

    classNames: PropTypes.object.isRequired,

    signIn: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  static defaultProps = {
    classNames: classes,
    i18n: createI18n(language),
  }

  submit = (values) => {
    // print the form values to the console
    console.info(values)
  }

  render () {
    const { i18n, classNames, signIn } = this.props

    return <Form i18n={i18n} className={classNames.form} onSubmit={signIn} />
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
