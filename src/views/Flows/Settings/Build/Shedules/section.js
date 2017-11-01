import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Header from '../components/Header'
import Shedules from './shedules'
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
    flowId: PropTypes.string.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  render () {
    const { i18n, flowId } = this.props
    return <section>
      <Header title={i18n('定时任务')}
        subTitle={i18n('这里是关于定时任务的简单描述   查看帮助文档')}
      />
      <Shedules flowId={flowId} i18n={i18n} />
    </section>
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(FlowShedulesSetting)
