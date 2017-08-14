import React from 'react'
import PropTypes from 'prop-types'

import classes from './mapping.scss'

function Mapping ({ children }) {
  return <table className={classes.table}>
    <tbody>
      {children}
    </tbody>
  </table>
}
Mapping.propTypes = {
  children: PropTypes.node
}

function Legend ({ name, rightIcon }) {
  return <tr className={classes.legend}>
    <td colSpan={2}>
      <div className={classes.between}>
        <div>{name}</div>
        {rightIcon}
      </div>
    </td>
  </tr>
}
Legend.propTypes = {
  name: PropTypes.string,
  rightIcon: PropTypes.node
}

function Entry ({ name, value }) {
  return <tr>
    <td className={classes.name}>{name}</td>
    <td className={classes.value}>{value}</td>
  </tr>
}

Entry.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
}

export default Mapping
export {
  Mapping,
  Legend,
  Entry
}
