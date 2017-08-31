import React from 'react'
import { node } from 'prop-types'

import classes from './table.scss'

export default function AdminListHead ({ children }) {
  return <thead className={classes.thead}>
    {children}
  </thead>
}

AdminListHead.propTypes = {
  children: node,
}
