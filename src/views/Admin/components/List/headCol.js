import React from 'react'
import { node, string } from 'prop-types'

import classes from './table.scss'

export default function AdminListCol ({ children, className }) {
  return <th className={`${classes.th} ${className}`}>
    {children}
  </th>
}

AdminListCol.propTypes = {
  children: node,
  className: string,
}
AdminListCol.defaultProps = {
  className: ''
}
