import React, { PureComponent } from 'react'
import { func } from 'prop-types'
import { map } from 'react-immutable-proptypes'

import { Link } from 'react-router'

import Button from 'components/Button'
import AgentIcon from 'components/Icon/Agent'

import classes from './agents.scss'

export default class Agent extends PureComponent {
  static propTypes = {
    agent: map.isRequired,

    stop: func.isRequired,
    shutdown: func.isRequired,
  }

  handleStop = () => {
    const { stop, agent } = this.props
    return stop(agent.get('flowName'), agent.get('number'))
  }

  handleShutDown = () => {
    const { shutdown, agent } = this.props
    return shutdown(agent.get('zone'), agent.get('name'),
      'dialog password result')
  }

  render () {
    const { agent } = this.props
    const status = agent.get('agentStatus')
    const flow = agent.get('flowName')
    const number = agent.get('number')
    const branch = agent.get('branch')

    const job = flow ? `${flow} / #${number} ${branch}` : ''

    const canShutDown = status !== 'OFFLINE'
    const canStop = status === 'RUNNING'

    return <tr className={classes.agent}>
      <td>
        <AgentIcon status={status} />
      </td>
      <td>
        {agent.get('zoneWithName')}
      </td>
      <td>
        {!!job && <Link to={`/flows/${flow}/jobs/${number}`}>{job}</Link>}
      </td>
      <td className={classes.actions}>
        <Button size='sm' className='btn-inverse'
          onClick={this.handleStop} disabled={!canStop}>
          停止任务
        </Button>
        <Button size='sm' className='btn-inverse'
          onClick={this.handleShutDown} disabled={!canShutDown}>
          关机
        </Button>
      </td>
    </tr>
  }
}
