import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { map } from 'react-immutable-proptypes'

import { Link } from 'react-router'

import Button from 'components/Button'
import AgentIcon from 'components/Icon/Agent'
import ClipboardButton from 'components/ClipboardButton'

import { ListRow, ListCol } from '../../components/List'

import classes from './agents.scss'

export default class Agent extends PureComponent {
  static propTypes = {
    agent: map.isRequired,

    stop: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    openDetail: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  handleStop = () => {
    const { stop, agent } = this.props
    return stop(agent)
  }

  handleClose = () => {
    const { close, agent } = this.props
    return close(agent)
  }

  handleCheck = () => {
    const { openDetail, agent } = this.props
    return openDetail(agent)
  }

  handleRemove = () => {
    const { remove, agent } = this.props
    return remove(agent)
  }

  render () {
    const { agent, i18n } = this.props
    const status = agent.get('agentStatus')
    const flow = agent.get('flowName')
    const number = agent.get('number')
    const branch = agent.get('branch')

    const job = flow ? `${flow} / #${number} ${branch}` : ''

    const isOnline = status !== 'OFFLINE'
    const isBusy = status === 'BUSY'

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
          onClick={this.handleStop} disabled={!isBusy}>
          {i18n('stop build')}
        </Button>
        <Button size='sm' className='btn-inverse'
          onClick={this.handleClose} disabled={!isOnline}>
          {i18n('shut down')}
        </Button>
        <Button size='sm' className='btn-inverse'
          onClick={this.handleCheck} disabled={!isOnline}>
          {i18n('see more')}
        </Button>
        <Button size='sm' className='btn-inverse'
          onClick={this.handleRemove}>
          {i18n('delete')}
        </Button>
      </ListCol>
    </ListRow>
  }
}
