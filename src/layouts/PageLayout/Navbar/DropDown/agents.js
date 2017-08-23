import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { STATUS } from 'redux-http'
import autoCancel from 'react-promise-cancel'

import { actions } from 'redux/modules/agent'

import Loading from 'components/Loading'
import AgentIcon from 'components/Icon/Agent'

import DropDown from './dropdown'

import classes from './agents.scss'

function mapStateToProps (state, props) {
  const { agent } = state
  return {
    agents: agent.get('list'),
    loaded: agent.getIn(['ui', 'QUERY']) > STATUS.send,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    query: actions.query,
  }, dispatch)
}

export class AgentsDropDown extends PureComponent {
  static propTypes = {
    agents: ImmutablePropTypes.listOf(ImmutablePropTypes.contains({
      id: PropTypes.string.isRequired,
      zoneWithName: PropTypes.string.isRequired,
      agentStatus: PropTypes.string.isRequired,

      flowName: PropTypes.string,
      number: PropTypes.number,
      branch: PropTypes.string,
    })),
    loaded: PropTypes.bool,

    query: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  componentDidMount () {
    const { query } = this.props
    query()
  }

  renderAgent (agent) {
    const flow = agent.get('flowName')
    const number = agent.get('number')
    const branch = agent.get('branch')

    const job = flow ? `${flow} / #${number} ${branch}` : ''
    return <tr key={agent.get('id')}>
      <td className={classes.statusCell}>
        <AgentIcon status={agent.get('agentStatus')} />
      </td>
      <td>{agent.get('zoneWithName')}</td>
      <td>{job}</td>
    </tr>
  }

  renderAgents () {
    const { i18n, agents } = this.props
    return <div>
      <div className={classes.header}>
        {i18n('Agent 状态')}
      </div>
      <table className={classes.table}>
        <thead>
          <tr>
            <th className={classes.status}>{i18n('运行状态')}</th>
            <th className={classes.name}>{i18n('Agent')}</th>
            <th className={classes.job}>{i18n('任务')}</th>
          </tr>
        </thead>
        <tbody>
          {agents.map(this.renderAgent.bind(this))}
        </tbody>
      </table>
    </div>
  }

  renderEmpty () {
    const { i18n } = this.props
    return <div className={classes.paddingWrap}>
      {i18n('没有检测到 Agent')}
    </div>
  }

  renderContent () {
    const { agents } = this.props
    return agents.size ? this.renderAgents() : this.renderEmpty()
  }

  renderLoading () {
    return <div className={classes.paddingWrap}>
      <Loading />
    </div>
  }

  render () {
    const { loaded } = this.props
    return <DropDown className={classes.dropdown} arrowClass={classes.arrow}>
      {loaded ? this.renderContent() : this.renderLoading()}
    </DropDown>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  autoCancel({ funcs: ['query'] })(AgentsDropDown)
)
