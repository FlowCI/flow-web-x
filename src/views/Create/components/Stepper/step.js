import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classes from './step.scss'

export default class Step extends Component {
  static propTypes = {
    active: PropTypes.bool,
    step: PropTypes.shape({
      icon: PropTypes.node.isRequired,
      name: PropTypes.string.isRequired,
      component: PropTypes.any,
      thumnail: PropTypes.any,
    }).isRequired,
    params: PropTypes.any,
    activeButton: PropTypes.node,
  }

  render () {
    const {
      active, params,
      activeButton,
      step: { icon, name, component, thumnail },
    } = this.props

    const cls = [classes.step]
    active && cls.push(classes.active)

    const childComponent = active ? component : thumnail

    return <div className={cls.join(' ')}>
      <span className={classes.icon}>{icon}</span>
      <div className={classes.container}>
        <div className={classes.header}>
          <span>{name}</span>
          {active && activeButton}
        </div>
        <div className={classes.content}>
          {!!childComponent && React.createElement(childComponent, { params })}
        </div>
      </div>
    </div>
  }
}
