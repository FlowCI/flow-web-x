import React from 'react'
import PropTypes from 'prop-types'

import classes from './arrow.scss'

export default function Arrow ({ up, className }) {
  const cls = [classes.arrow, className]
  up && cls.push(classes.up)
  return <i className={cls.join(' ')} />
}

Arrow.propTypes = {
  up: PropTypes.bool, // is arrow direction of up
  className: PropTypes.string,
}
Arrow.defaultProps = {
  className: ''
}
