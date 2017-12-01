import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import i18n from '../i18n'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'

import autoCancel from 'react-promise-cancel'
import { isSuccess } from 'redux-http'

import { actions } from 'redux/modules/agent'
import { actions as jobActions } from 'redux/modules/job'
import { actions as alertActions } from 'redux/modules/alert'

import Loading from 'components/Loading'
import { Confirm } from 'components/Modal'

import ConfigDialog from '../components/ConfigDialog'
import Toolbar from './toolbar'
import Agents from './agents'

const countsSelector = createSelector(
  (agents) => agents,
  (agents) => {
    const counts = agents.reduce((cat, agent) => {
      switch (agent.get('agentStatus')) {
        case 'BUSY':
          cat.BUSY++
          break
        case 'IDLE':
          cat.IDLE++
          break
        case 'OFFLINE':
          cat.OFFLINE++
          break
      }
      return cat
    }, {
      BUSY: 0,
      IDLE: 0,
      OFFLINE: 0,
    })
    counts.ALL = agents.size
    return counts
  }
)
function mapStateToProps (state, props) {
  const { agent } = state
  const agents = agent.get('list')
  return {
    agents: agents,
    counts: countsSelector(agents),
    loading: !isSuccess(agent.getIn(['ui', 'QUERY'])),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    stop: jobActions.stop,
    query: actions.query,
    close: actions.close,
    remove: actions.remove,
    alert: alertActions.alert,
  }, dispatch)
}

export class AdminAgentView extends Component {
  static propTypes = {
    agents: ImmutablePropTypes.list.isRequired,
    counts: PropTypes.shape({
      BUSY: PropTypes.number.isRequired,
      IDLE: PropTypes.number.isRequired,
      OFFLINE: PropTypes.number.isRequired,
      ALL: PropTypes.number.isRequired,
    }).isRequired,
    loading: PropTypes.bool,
    query: PropTypes.func.isRequired,
    stop: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    alert: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  static defaultProps = {
    i18n: i18n.createChild('list'),
  }

  state = {
    category: 'ALL',
    openConfirm: false,
    openConfig: false,
  }

  componentDidMount () {
    const { query } = this.props
    query()
  }

  selectCategory = (category) => {
    this.setState({ category })
  }

  openConfirm = (agent) => {
    this.setState({ selected: agent, openConfirm: true })
  }

  closeConfirm = () => {
    this.setState({ openConfirm: false, selected: undefined })
  }

  openConfig = (agent) => {
    this.setState({ selected: agent, openConfig: true })
  }

  closeConfig = () => {
    this.setState({ openConfig: false, selected: undefined })
  }

  handleRemove = () => {
    const { selected } = this.state
    const { remove, alert } = this.props
    return remove(selected)
      .then(this.closeConfirm, this.closeConfirm)
      .then(() => {
        alert('success', '删除成功')
      })
  }

  stopBuild = (agent) => {
    const { stop } = this.props
    return stop(agent.get('flowName'), agent.get('number'))
  }

  renderLoading () {
    return <div>
      <Loading />
    </div>
  }

  renderAgents () {
    const { agents, close, i18n } = this.props
    const { category } = this.state
    return <Agents agents={agents} category={category}
      remove={this.openConfirm} stop={this.stopBuild}
      openDetail={this.openConfig}
      close={close} i18n={i18n}
    />
  }

  render () {
    const { loading, i18n, counts } = this.props
    const { openConfirm, openConfig, category, selected } = this.state

    const confirmTitle = selected ? i18n('removeConfirm', {
      name: selected.get('name')
    }) : 'Confirm'

    return <div>
      {!loading && <Toolbar category={category} counts={counts}
        i18n={i18n.createChild('toolbar')}
        onChange={this.selectCategory} />}
      {loading ? this.renderLoading()
        : this.renderAgents()}

      <Confirm isOpen={openConfirm} title={confirmTitle}
        onCancel={this.closeConfirm}
        onOk={this.handleRemove}
      />
      <ConfigDialog agent={selected} isOpen={openConfig}
        onRequestClose={this.closeConfig}
      />
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  autoCancel({ funcs: ['query'] })(AdminAgentView)
)
