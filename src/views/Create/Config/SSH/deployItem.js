import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import Checkbox from 'components/Form/Checkbox'

export default class DeployListItem extends Component {
  static propTypes = {
    deploy: ImmutablePropTypes.map.isRequired,
    checked: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
  }

  handleChange = (v) => {
    const { onChange, deploy } = this.props
    return onChange(deploy, v)
  }

  render () {
    const { checked, deploy } = this.props
    return <li>
      <Checkbox checked={checked} onChange={this.handleChange}
        rightLabel={deploy.get('name')}
        checkedIcon={<i className='icon checked icon-circle-check' />}
        unCheckedIcon={<i className='icon checked icon-radio-unchecked' />}
      />
    </li>
  }
}
