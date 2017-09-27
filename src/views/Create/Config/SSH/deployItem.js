import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import Checkbox from 'components/Form/Checkbox'
import Button from 'components/Button'
import ClipboardButton from 'components/ClipboardButton'

import classes from './deploy.scss'

const checkedIcon = <i className='icon checked icon-circle-check' />
const unCheckedIcon = <i className='icon checked icon-radio-unchecked' />

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
    const deployKey = deploy.getIn(['detail', 'publickKey'])

    return <li className={classes.item}>
      <Checkbox
        checked={checked} onChange={this.handleChange}
        checkedIcon={checkedIcon} unCheckedIcon={unCheckedIcon}
      />
      <div className={classes.desc}>
        <span>{deploy.get('name')}</span>
        <ul className={classes.actions}>
          <li>
            <Button className='btn-link' size='sm'>显示完整内容</Button>
          </li>
          <li>
            <ClipboardButton className='btn-link' size='sm'
              data-clipboard-text={deployKey} />
          </li>
        </ul>
      </div>
    </li>
  }
}
