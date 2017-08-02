import React from 'react'
import PropTypes from 'prop-types'

import classes from './container.scss'

export default function Container ({ children, className }) {
  return <div className={`${classes.container} ${className}`}>{children}</div>
}

Container.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}

Container.defaultProps = {
  className: ''
}
