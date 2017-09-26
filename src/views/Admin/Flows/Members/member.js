import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { map } from 'react-immutable-proptypes'

import Checkbox from 'components/Form/Checkbox'

import classes from './members.scss'

export default class MemeberCheckbox extends PureComponent {
  static propTypes = {
    user: map.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  handleChange = (checked) => {
    const { onChange, user } = this.props
    return onChange(user, checked)
  }

  render () {
    const { user, ...other } = this.props
    return <li className={classes.item}>
      <Checkbox {...other} rightLabel={user.get('username')}
        onChange={this.handleChange} />
    </li>
  }
}
