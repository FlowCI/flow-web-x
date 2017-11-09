import React, { Component } from 'react'
import { number, func, bool } from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import autoCancel from 'react-promise-cancel'
import { STATUS } from 'redux-http'

import createI18n from '../i18n'
import language from 'util/language'

import { actions } from 'redux/modules/credential'
import { actions as alertActions } from 'redux/modules/alert'

import DocumentTitle from 'react-document-title'

import Loading from 'components/Loading'
import {
  TabBars,
  Tab
} from '../../components/TabBars'

import RSAList from './RSA'

function mapStateToProps (state, props) {
  const { credential } = state

  return {
    rsaCount: credential.get('RSA').size,
    iosCount: credential.get('IOS').size,
    loading: credential.getIn(['ui', 'QUERY']) !== STATUS.success,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    query: actions.query,
    remove: actions.remove,

    alert: alertActions.alert,
  }, dispatch)
}

export class AdminCredentialList extends Component {
  static propTypes = {
    rsaCount: number,
    iosCount: number,
    loading: bool,
    query: func.isRequired,
    remove: func.isRequired,
    alert: func.isRequired,
    i18n: func.isRequired,
  }

  static defaultProps = {
    i18n: createI18n(language).createChild('list'),
  }

  state = {
    tab: 'rsa',
  }

  componentDidMount () {
    const { query } = this.props
    query()
  }

  handleTabChange = (v) => {
    this.setState({ tab: v })
  }

  renderToolBar () {
    const { i18n, rsaCount, iosCount } = this.props
    const { tab } = this.state
    return <TabBars value={tab} onChange={this.handleTabChange}>
      <Tab value='rsa' text={i18n('rsa.title', { count: rsaCount })} />
      <Tab value='ios' text={i18n('iosCert.title', { count: iosCount })} />
    </TabBars>
  }

  renderList () {
    const { tab } = this.state
    const { remove, alert } = this.props
    if (tab === 'rsa') {
      return <RSAList remove={remove} alert={alert} />
    }
  }

  render () {
    const { loading } = this.props
    return <DocumentTitle title='证书列表 · 控制台'>
      <div>
        {loading && <Loading />}
        {!loading && this.renderToolBar()}
        {!loading && this.renderList()}
      </div>
    </DocumentTitle>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  autoCancel({ funcs: ['query'] })(AdminCredentialList)
)
