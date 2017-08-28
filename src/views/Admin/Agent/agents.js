import React, { Component } from 'react'
import { bool, func } from 'prop-types'
import { list } from 'react-immutable-proptypes'

import createI18n from './i18n'
import language from 'util/language'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import autoCancel from 'react-promise-cancel'
import { STATUS } from 'redux-http'

import { actions } from 'redux/modules/agent'
import { actions as jobActions } from 'redux/modules/job'

import Loading from 'components/Loading'
import { NavTabs } from 'components/NavTabs'
import AgentIcon from 'components/Icon/Agent'

import classes from './agents.scss'

function mapStateToProps (state, props) {
  const { agent } = state
  return {
    agents: agent.get('list'),
    loading: agent.getIn(['ui', 'QUERY']) !== STATUS.success,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    query: actions.query,
    stop: jobActions.stop,
  }, dispatch)
}

export class AdminAgentView extends Component {
  static propTypes = {
    agents: list.isRequired,
    loading: bool,

    query: func.isRequired,
    stop: func.isRequired,
    i18n: func.isRequired,
  }

  static defaultProps = {
    i18n: createI18n(language),
  }

  componentDidMount () {
    const { query } = this.props
    query()
  }

  renderAgent = (agent) => {
    const flow = agent.get('flowName')
    const number = agent.get('number')
    const branch = agent.get('branch')

    const job = flow ? `${flow} / #${number} ${branch}` : ''
    return <tr key={agent.get('zoneWithName')} className={classes.agent}>
      <td>
        <AgentIcon status={agent.get('agentStatus')} />
      </td>
      <td>
        {agent.get('zoneWithName')}
      </td>
      <td>
        {!!job && <a>{job}</a>}
      </td>
      <td>
        <button className='btn btn-sm'>
          停止任务
        </button>&nbsp;&nbsp;
        <button className='btn btn-sm'>
          关机
        </button>
      </td>
    </tr>
  }

  renderAgents () {
    const { agents, i18n } = this.props
    return <table className={classes.agents}>
      <thead>
        <tr>
          <th className={classes.status}>{i18n('运行状态')}</th>
          <th className={classes.name}>{i18n('Agent')}</th>
          <th className={classes.job}>{i18n('任务')}</th>
          <th className={classes.actions}>{i18n('操作')}</th>
        </tr>
      </thead>
      <tbody>
        {agents.map(this.renderAgent)}
      </tbody>
    </table>
  }

  renderFilter () {
    const { agents } = this.props
    const cate = agents.reduce((cat, agent) => {
      switch (agent.get('agentStatus')) {
        case 'RUNNING':
          cat.running++
          break
        case 'IDLE':
          cat.stop++
          break
        case 'OFFLINE':
          cat.shutdown++
          break
      }
      return cat
    }, {
      running: 0,
      stop: 0,
      shutdown: 0,
    })
    cate.all = agents.size
    return <ul>
      <li>全部({cate.all})</li>
      <li>运行中({cate.running})</li>
      <li>已停止({cate.stop})</li>
      <li>已关机({cate.shutdown})</li>
    </ul>
  }

  renderLoading () {
    return <div>
      <Loading />
    </div>
  }

  render () {
    const { loading } = this.props
    return <div className={classes.container}>
      <NavTabs className={classes.navs}>
        Agent
      </NavTabs>
      {!loading && this.renderFilter()}
      {loading ? this.renderLoading() : this.renderAgents()}
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  autoCancel({ funcs: ['query'] })(AdminAgentView)
)
