import React, { Component } from 'react'
import PropTypes from 'prop-types'

import ImmutablePropTypes from 'react-immutable-proptypes'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'

import { actions } from 'redux/modules/alert'

import { AlertGroup, Transition } from 'components/AlertGroup'

import AlertItem from './item'

import classes from './alerts.scss'

const alertsSelector = createSelector(
  (alert) => alert.get('list'),
  (alert) => alert.get('data'),
  (list, data) => list.map((id) => data.get(id))
)
function mapStateToProps (state, props) {
  const { alert } = state
  return {
    alerts: alertsSelector(alert),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    close: actions.dismiss,
  }, dispatch)
}

export class AlertControl extends Component {
  static propTypes = {
    alerts: ImmutablePropTypes.iterable.isRequired,
    close: PropTypes.func.isRequired,
  }

  render () {
    const { alerts, close } = this.props
    return <AlertGroup className={classes.container}>
      {alerts.map((item) => <Transition key={item.get('id')} >
        <AlertItem alert={item} close={close} />
      </Transition>)}
    </AlertGroup>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AlertControl)
