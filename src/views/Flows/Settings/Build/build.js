import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Trigger from './Trigger'
import Shedules from './Shedules'
import classes from './build.scss'

export default class FlowBuildSetting extends Component {
  static propTypes = {
    params: PropTypes.shape({
      flowId: PropTypes.string.isRequired,
    }).isRequired,
    i18n: PropTypes.func.isRequired,
  }

  static defaultProps = {
    i18n: function (n) { return n }
  }

  render () {
    const { params: { flowId }, i18n } = this.props
    return <div className={classes.build}>
      <Trigger flowId={flowId} i18n={i18n} />
      <Shedules flowId={flowId} i18n={i18n} />
    </div>
  }
}
