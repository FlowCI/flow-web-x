import React, { Component } from 'react'
import { number, func, bool } from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import autoCancel from 'react-promise-cancel'
import { STATUS } from 'redux-http'

import createI18n from '../i18n'
import language from 'util/language'

import { actions } from 'redux/modules/credential'

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
  }, dispatch)
}

export class AdminCredentialList extends Component {
  static propTypes = {
    rsaCount: number,
    iosCount: number,
    loading: bool,
    query: func.isRequired,
    remove: func.isRequired,
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
    const { remove } = this.props
    if (tab === 'rsa') {
      return <RSAList remove={remove} />
    }
  }

  render () {
    const { loading } = this.props
    return <div>
      {loading && <Loading />}
      {!loading && this.renderToolBar()}
      {!loading && this.renderList()}
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  autoCancel({ funcs: ['query'] })(AdminCredentialList)
)
