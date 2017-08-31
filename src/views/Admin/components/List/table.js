import React from 'react'
import { node, string } from 'prop-types'
import classes from './table.scss'

export default function AdminList ({ children, className }) {
  return <table className={`${classes.table} ${className}`}>
    {children}
  </table>
}

AdminList.propTypes = {
  children: node,
  className: string,
}
AdminList.defaultProps = {
  className: ''
}
