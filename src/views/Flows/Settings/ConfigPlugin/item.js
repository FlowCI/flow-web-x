import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import Control from './control'

import classes from './item.scss'

export default class ConfigPluginEnv extends Component {
  static propTypes = {
    item: ImmutablePropTypes.map.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  }

  handleChange = (value) => {
    const { item, onChange } = this.props
    const name = item.get('name')
    onChange(name, value)
  }

  render () {
    const { item, value } = this.props
    const name = item.get('name')
    return <div className={classes.item}>
      <span className={classes.name}>{name}</span>
      <div className={classes.control}>
        <Control value={value}
          item={item} onChange={this.handleChange} />
      </div>
    </div>
  }
}
