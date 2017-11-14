import React from 'react'
import PropTypes from 'prop-types'

import classes from './ballPulse.scss'

export default function BallPulse ({ className }) {
  return <div className={`${classes['ball-pulse']} ${className}`}>
    <div />
    <div />
    <div />
  </div>
}

BallPulse.propTypes = {
  className: PropTypes.string,
}

BallPulse.defaultProps = {
  className: ''
}
