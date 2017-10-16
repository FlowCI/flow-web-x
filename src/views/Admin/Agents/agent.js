import React, { PureComponent } from 'react'
import { func } from 'prop-types'
import { map } from 'react-immutable-proptypes'

import { Link } from 'react-router'

import Button from 'components/Button'
import AgentIcon from 'components/Icon/Agent'
import ClipboardButton from 'components/ClipboardButton'

import { ListRow, ListCol } from '../components/List'

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
    return shutdown(agent, 'dialog password result')
  }

  render () {
    const { agent } = this.props
    const status = agent.get('agentStatus')
    const flow = agent.get('flowName')
    const number = agent.get('number')
    const branch = agent.get('branch')

    const job = flow ? `${flow} / #${number} ${branch}` : ''

    const canShutDown = status !== 'OFFLINE'
    const canStop = status === 'BUSY'

    const encodeForm = encodeURIComponent('/admin/agents')
    const token = agent.get('token')
    return <ListRow>
      <ListCol className={classes.status}>
        <AgentIcon status={status} />
      </ListCol>
      <ListCol className={classes.name}>
        {agent.get('zoneWithName')}
      </ListCol>
      <ListCol className={classes.job}>
        {!!job && <Link
          to={`/flows/${flow}/jobs/${number}?from=${encodeForm}`}
        >
          {job}
        </Link>}
      </ListCol>
      <ListCol className={classes.token}>
        <div className={classes.tokenWrapper}>
          <span>{token}</span>
          {!!token && <ClipboardButton className={classes.copy}
            data-clipboard-text={token} />}
        </div>
      </ListCol>
      <ListCol className={classes.actions}>
        <Button size='sm' className='btn-inverse'
          onClick={this.handleStop} disabled={!canStop}>
          停止任务
        </Button>
        <Button size='sm' className='btn-inverse'
          onClick={this.handleShutDown} disabled={!canShutDown}>
          关机
        </Button>
      </ListCol>
    </ListRow>
  }
}
