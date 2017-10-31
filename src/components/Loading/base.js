import React, { Component } from 'react'
import PropTypes from 'prop-types'

export function getLineScaleStyle (props) {
  const style = {}
  const { color, size } = props
  if (color) {
    style.backgroundColor = color
  }
  if (size) {
    style.height = `${size}px`
  }
  return style
}

export function getCircleStyle (props) {
  const style = {}
  const { color, size } = props
  if (color) {
    style.backgroundColor = color
  }
  if (size) {
    style.height = `${size}px`
    style.width = `${size}px`
  }
  return style
}

export default class Loading extends Component {
  static propTypes = {
    className: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    color: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    size: PropTypes.number // eslint-disable-line react/no-unused-prop-types
  };

  static defaultProps = {
    className: ''
  }

  render () {
    return (
      <div>Must Overrider function Render</div>
    )
  }
}
