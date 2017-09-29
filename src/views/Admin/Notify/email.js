import React, { Component } from 'react'
import { bool, func } from 'prop-types'
import { record } from 'react-immutable-proptypes'

import createI18n from './i18n'
import language from 'util/language'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { STATUS } from 'redux-http'

import { actions } from 'redux/modules/notifySetting'
import { actions as alertActions } from 'redux/modules/alert'

import Loading from 'components/Loading'
import Title from '../components/Title'
import Form from './form'

function mapStateToProps (state, props) {
  const { notifySetting } = state
  return {
    loading: notifySetting.getIn(['ui', 'GET_EMAIL']) !== STATUS.success,
    setting: notifySetting.get('email')
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    save: actions.saveEmailSetting,
    test: actions.testEmailSetting,
    get: actions.getEmailSetting,
    alert: alertActions.alert,
  }, dispatch)
}

export class AdminNotifyEmail extends Component {
  static propTypes = {
    loading: bool,
    setting: record,

    get: func.isRequired,
    test: func.isRequired,
    save: func.isRequired,
    i18n: func.isRequired,
    alert: func.isRequired,
  }

  static defaultProps = {
    i18n: createI18n(language),
  }

  componentDidMount () {
    const { get } = this.props
    get()
  }

  handleSave = (values) => {
    const { save, alert } = this.props
    return save(values).then(() => {
      alert('success', '保存成功')
    }, () => {
      alert('failure', '保存失败')
    })
  }

  handleTest = (values) => {
    const { test, alert } = this.props
    return test(values).then(() => {
      alert('success', '测试成功')
    }, () => {
      alert('failure', '测试发送失败')
    })
  }

  render () {
    const { loading, setting, i18n } = this.props
    return <div>
      <Title title={i18n('title')} subTitle={i18n('subTitle')} />
      {loading ? <Loading />
        : <Form initialValues={setting.toJSON()} i18n={i18n} enableReinitialize
          onSubmit={this.handleSave} onTest={this.handleTest} />
      }
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminNotifyEmail)
