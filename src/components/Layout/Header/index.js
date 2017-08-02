import React from 'react'
import PropTypes from 'prop-types'

import classes from './header.scss'

export default function Header ({ children, className }) {
  return <div className={`${classes.header} ${className}`}>
    {children}
  </div>
}

Header.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}

Header.defaultProps = {
  className: ''
}
