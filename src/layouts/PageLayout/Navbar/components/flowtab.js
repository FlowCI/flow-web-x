import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Link } from 'react-router'
import Icon from 'components/Icon/Flow'

import classes from './flowtab.scss'

function mapStateToProps (state, { id }) {
  const { flow } = state
  return {
    name: flow.getIn(['data', id, 'name']),
    status: flow.getIn(['status', id, 'status']),
  }
}

export class FlowTab extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }

  render () {
    const { name, id, status } = this.props
    const cls = [classes.tab, classes[status]]
    return <Link to={`/flows/${id}`}
      activeClassName='active'
      className={cls.join(' ')}>
      <Icon status={status} className={classes.icon} />{name}
    </Link>
  }
}

export default connect(mapStateToProps)(FlowTab)
