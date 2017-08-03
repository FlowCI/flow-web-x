import React from 'react'
import PropTypes from 'prop-types'

import classes from './circle.scss'

import Loading from '../base'

function getArcLength (percent, radius) {
  return percent * 2 * radius * Math.PI
}

export default class CircleLoading extends Loading {
  static propTypes = {
    ...Loading.propTypes,
    thickness: PropTypes.number
  };

  static defaultProps = {
    ...Loading.defaultProps,
    size: 40,
    color: '#5767D0', // $color-primary, must copy
    thickness: 3
  };

  state = {
    diameter: getArcLength(1, (this.props.size - this.props.thickness) / 2)
  }

  componentDidMount () {
    const { path } = this.refs
    this.scalePath(path)
  }

  componentWillReceiveProps (nextProps) {
    const { size, thickness } = this.props
    const { size: s, thickness: t } = nextProps
    if (size !== s || thickness !== t) {
      this.setState({ diameter: getArcLength(1, (s - t) / 2) })
    }
  }

  componentWillUnmount () {
    clearTimeout(this.scalePathTimer)
  }

  scalePath (path, step = 0) {
    const { diameter } = this.state
    step = step % 3
    switch (step) {
      case 0:
        path.style.transitionDuration = '0ms'
        path.style.strokeDasharray = `3 ${diameter}`
        path.style.strokeDashoffset = '0'
        break
      case 1:
        path.style.transitionDuration = '700ms'
        path.style.strokeDasharray = `${0.7 * diameter} ${diameter}`
        path.style.strokeDashoffset = -0.3 * diameter
        break
      case 2:
        path.style.transitionDuration = '700ms' // 多出100ms用于显示最后一点
        path.style.strokeDasharray = `${0.7 * diameter} ${diameter}`
        path.style.strokeDashoffset = 3 - diameter
        // return
        break
    }
    this.scalePathTimer = setTimeout(() => {
      this.scalePath(path, step + 1)
    }, step ? 700 : 100)
  }

  render () {
    const { color, size, thickness } = this.props
    const center = size / 2
    const radius = (size - thickness) / 2
    const style = {
      width: `${size}px`,
      height: `${size}px`
    }
    return <svg style={style} className={classes.wrap}
      ref='wrap' viewBox={`0 0 ${size} ${size}`}>
      <circle className={classes.circle} ref='path'
        cx={center} cy={center} r={radius}
        fill='none' strokeLinecap='round'
        strokeWidth={thickness} stroke={color} />
    </svg>
  }
}
