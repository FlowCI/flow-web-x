import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Step extends Component {
  static propTypes = {
    active: PropTypes.bool,
    step: PropTypes.shape({
      icon: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      component: PropTypes.any,
      thumnail: PropTypes.any,
    }).isRequired,
    params: PropTypes.any,
  }

  render () {
    const { active, params, step: { icon, name, component } } = this.props

    const cls = []
    active && cls.push('active')

    return <div className={cls.join(' ')}>
      <i className={`icon ${icon}`} />
      {name}
      {active && React.createElement(component, { params })}
    </div>
  }
}
