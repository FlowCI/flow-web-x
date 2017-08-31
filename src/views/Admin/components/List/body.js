import React from 'react'
import { node } from 'prop-types'

export default function AdminListBody ({ children }) {
  return <tbody>
    {children}
  </tbody>
}

AdminListBody.propTypes = {
  children: node,
}
