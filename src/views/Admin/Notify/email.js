import React, { Component } from 'react'
import PropTypes from 'prop-types'

import createI18n from './i18n'
import language from 'util/language'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'
import { STATUS } from 'redux-http'

import { actions } from 'redux/modules/notifySetting'
import { actions as alertActions } from 'redux/modules/alert'

import DocumentTitle from 'react-document-title'

import Loading from 'components/Loading'
import Title from '../components/Title'
import Form from './form'

const settingSelectors = createSelector(
  (setting) => setting,
  (setting) => setting.toJSON()
)
function mapStateToProps (state, props) {
  const { notifySetting } = state
  return {
    loading: notifySetting.getIn(['ui', 'GET_EMAIL']) !== STATUS.success,
    setting: settingSelectors(notifySetting.get('email'))
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
    loading: PropTypes.bool,
    setting: PropTypes.object,

    get: PropTypes.func.isRequired,
    test: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
    alert: PropTypes.func.isRequired,
  }

  static defaultProps = {
    i18n: createI18n(language),
  }

  componentDidMount () {
    const { get } = this.props
    get()
  }

  handleSave = (values) => {
    /**
     * 由于 isAuthenticated 为 false 时，values 里面还会包含 username、password
     * 所以删除掉
     */
    const params = { ...values }
    const { isAuthenticated } = values
    if (!isAuthenticated) {
      params.username = undefined
      params.password = undefined
    }
    const { save, alert } = this.props
    return save(params).then(() => {
      alert('success', '保存成功')
    })
  }

  handleTest = (values) => {
    const { test, alert } = this.props
    return test(values).then(() => {
      alert('success', '测试成功')
    })
  }

  render () {
    const { loading, setting, i18n } = this.props
    return <DocumentTitle title='邮件设置 · 控制台'>
      <div>
        <Title title={i18n('title')} subTitle={i18n('subTitle')} />
        {loading ? <Loading />
          : <Form initialValues={setting} i18n={i18n} pure
            onSubmit={this.handleSave}
            onTest={this.handleTest} />
        }
      </div>
    </DocumentTitle>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminNotifyEmail)
