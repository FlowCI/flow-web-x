import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classes from './form.scss'

export default class CreateMemberFieldSet extends Component {
  static propTypes = {
    required: PropTypes.bool,
    text: PropTypes.string,
    children: PropTypes.node,
  }

  render () {
    const { required, text, children } = this.props
    return <tr className={classes.fieldset}>
      <td className={classes.name}>
        {required && '*'}{text}
      </td>
      <td className={classes.control}>
        {children}
      </td>
    </tr>
  }
}
