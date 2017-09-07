import React, { Component } from 'react'
import { bool, func } from 'prop-types'
import { map } from 'react-immutable-proptypes'

import { Map } from 'immutable'

import createI18n from './i18n'
import language from 'util/language'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { STATUS } from 'redux-http'

import { actions } from 'redux/modules/notifySetting'

import Loading from 'components/Loading'
import Title from '../components/Title'
import Form from './form'

function mapStateToProps (state, props) {
  const { notifySetting } = state
  return {
    loading: false && notifySetting.getIn(['ui', 'GET_EMAIL']) !== STATUS.success,
    setting: notifySetting.get('email', new Map())
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    save: actions.saveEmailSetting,
    test: actions.testEmailSetting,
    get: actions.getEmailSetting,
  }, dispatch)
}

export class AdminNotifyEmail extends Component {
  static propTypes = {
    loading: bool,
    setting: map.isRequired,

    get: func.isRequired,
    test: func.isRequired,
    save: func.isRequired,
    i18n: func.isRequired,
  }

  static defaultProps = {
    i18n: createI18n(language),
  }

  componentDidMount () {
    const { get } = this.props
    get()
  }

  render () {
    const { loading, setting, i18n, save, test } = this.props
    return <div>
      <Title title={i18n('title')} subTitle={i18n('subTitle')} />
      {loading ? <Loading />
        : <Form initValues={setting} i18n={i18n}
          onSubmit={save} onTest={test} />
      }
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminNotifyEmail)
