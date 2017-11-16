import React from 'react'
import PropTypes from 'prop-types'

import classnames from 'classnames'
import classes from './form.scss'

export default function createSwitchAdapter (Component) {
  function SwitchAdapter (props) {
    const {
      input,
      meta, // eslint-disable-line no-unused-vars
      className,
      ...other,
    } = props
    return <Component {...input}
      {...other}
      checked={!!input.value}
      className={classnames(classes.field, className)}
    />
  }
  SwitchAdapter.propTypes = {
    input: PropTypes.object.isRequired,
    className: PropTypes.string,
    meta: PropTypes.any,
  }
  return SwitchAdapter
}
