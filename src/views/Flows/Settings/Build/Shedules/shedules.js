import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Shedule from './shedule'
function mapStateToProps (state, props) {
  const { flowId } = props
  const { flow } = state
  const f = flow.getIn(['data', flowId])
  return {
    flow: f,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    update: function () {}
  }, dispatch)
}

export class FlowShedulesSetting extends Component {
  static propTypes = {
    i18n: PropTypes.func.isRequired,
  }

  render () {
    return <ul>
      <Shedule text='' edit />
      <Shedule text='00000123123131' />
      <Shedule text='00000123123131231312' />
    </ul>
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(FlowShedulesSetting)
