import React from 'react'
import PropTypes from 'prop-types'

import TransitionGroup from 'react-transition-group/TransitionGroup'

export default function AlertGroup ({ children, className }) {
  return <TransitionGroup className={className}>
    {children}
  </TransitionGroup>
}

AlertGroup.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}
