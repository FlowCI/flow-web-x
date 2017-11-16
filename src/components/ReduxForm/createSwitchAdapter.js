import React from 'react'
import PropTypes from 'prop-types'

export default function createSwitchAdapter (Component) {
  function SwitchAdapter (props) {
    const {
      input,
      meta, // eslint-disable-line no-unused-vars
      ...other,
    } = props
    return <Component {...input} {...other} checked={!!input.value} />
  }
  SwitchAdapter.propTypes = {
    input: PropTypes.object.isRequired,
    meta: PropTypes.any,
  }
  return SwitchAdapter
}
