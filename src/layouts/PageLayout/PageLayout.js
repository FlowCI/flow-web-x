import React from 'react'
import PropTypes from 'prop-types'
import classes from './PageLayout.scss'

export const PageLayout = ({ children }) => (
  <div className={classes.container}>
    this is layout
    {children}
  </div>
)
PageLayout.propTypes = {
  children: PropTypes.node,
}

export default PageLayout
