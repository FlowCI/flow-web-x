import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Toggle from 'rc-components/Toggle'

import classes from './panel.scss'

export default class FlowBuildSettingPanel extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    enabled: PropTypes.bool,
    children: PropTypes.node,
    onToggle: PropTypes.func,
  }

  handleToggle = (checked) => {
    const { onToggle } = this.props
    return onToggle && onToggle(checked)
  }

  render () {
    const { title, enabled, children } = this.props
    return <div className={classes.panel}>
      <h5>
        {title}
        <Toggle size='sm' checked={enabled} onChange={this.handleToggle} />
      </h5>
      {children}
    </div>
  }
}
