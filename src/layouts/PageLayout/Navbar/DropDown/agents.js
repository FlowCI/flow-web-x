import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { fromJS } from 'immutable'

import { connect } from 'react-redux'

import DropDown from './dropdown'

import classes from './agents.scss'

function mapStateToProps (state, props) {
  return {
    agents: fromJS([{
      id: '1',
      status: 'success',
      name: 'mac - mini',
      job: 'xiaomi_ios_dev / #2 master',
    }, {
      id: '2',
      status: 'failure',
      name: 'mac - mini',
      job: 'xiaomi_ios_dev_xxxxxxxx / #2 master',
    }])
  }
}

export class AgentsDropDown extends PureComponent {
  static propTypes = {
    agents: ImmutablePropTypes.listOf(ImmutablePropTypes.contains({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      job: PropTypes.string,
    })),

    i18n: PropTypes.func.isRequired,
  }

  renderAgents () {
    const { i18n, agents } = this.props
    return <table className={classes.table}>
      <thead>
        <tr>
          <th className={classes.status}>{i18n('运行状态')}</th>
          <th className={classes.name}>{i18n('Agent')}</th>
          <th className={classes.job}>{i18n('任务')}</th>
        </tr>
      </thead>
      <tbody>
        {agents.map((agent) => <tr key={agent.get('id')}>
          <td className={classes.statusCell}>
            <span className={`${classes.circle} ${agent.get('status')}`} />
          </td>
          <td>{agent.get('name')}</td>
          <td>{agent.get('job')}</td>
        </tr>)}
      </tbody>
    </table>
  }

  render () {
    const { i18n } = this.props
    return <DropDown className={classes.dropdown} arrowClass={classes.arrow}>
      <div className={classes.header}>
        {i18n('Agent 状态机')}
      </div>
      {this.renderAgents()}
    </DropDown>
  }
}

export default connect(mapStateToProps)(AgentsDropDown)
