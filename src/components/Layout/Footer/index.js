import React from 'react'
import PropTypes from 'prop-types'

import classes from './footer.scss'

export default function Footer ({ children, className }) {
  return <footer className={`${classes.footer} ${className}`}>
    {children}
  </footer>
}

Footer.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}

Footer.defaultProps = {
  className: ''
}
