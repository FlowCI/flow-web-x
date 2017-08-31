import React from 'react'
import { node, string } from 'prop-types'

import classes from './table.scss'

export default function AdminListRow ({ children, className }) {
  return <tr className={`${classes.tr} ${className}`}>
    {children}
  </tr>
}

AdminListRow.propTypes = {
  children: node,
  className: string,
}
AdminListRow.defaultProps = {
  className: ''
}
