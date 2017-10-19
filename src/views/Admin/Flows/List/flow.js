import React, { PureComponent } from 'react'
import { func } from 'prop-types'
import { map } from 'react-immutable-proptypes'

import { connect } from 'react-redux'

import moment from 'moment'

import ClipboardButton from 'components/ClipboardButton'
import IconButton from 'components/IconButton'

import {
  ListRow,
  ListCol
} from '../../components/List'

import classes from './flows.scss'

function mapStateToProps (state, { flowId }) {
  const { flow } = state

  return {
    flow: flow.getIn(['data', flowId])
  }
}

export class AdminFlowListItem extends PureComponent {
  static propTypes = {
    flow: map.isRequired,
    i18n: func.isRequired,
    onRemove: func.isRequired,
  }

  handleRemove = () => {
    const { onRemove, flow } = this.props
    return onRemove(flow)
  }

  render () {
    const { flow, i18n } = this.props
    const webhook = flow.getIn(['envs', 'FLOW_GIT_WEBHOOK'])
    return <ListRow>
      <ListCol>{flow.get('name')}</ListCol>
      <ListCol>{flow.get('createdBy', '')}</ListCol>
      <ListCol>
        {moment(flow.get('createdAt') * 1000).format('YYYY.M.D')}
      </ListCol>
      <ListCol>
        <div className={classes.webhookWrapper}>
          <span>{webhook}</span>
          <ClipboardButton data-clipboard-text={webhook}
            i18n={i18n} className={classes.copy} />
        </div>
      </ListCol>
      <ListCol>
        {flow.getIn(['envs', 'FLOW_GIT_CREDENTIAL']) || ''}
      </ListCol>
      <ListCol>
        <IconButton className={classes.remove} onClick={this.handleRemove}>
          <i className='icon icon-trash' />
        </IconButton>
      </ListCol>
    </ListRow>
  }
}

export default connect(mapStateToProps)(AdminFlowListItem)
