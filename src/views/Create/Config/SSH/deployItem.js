import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import Checkbox, { classes as checkboxClass } from 'components/Form/Checkbox'
import Button from 'components/Button'
import ClipboardButton from 'components/ClipboardButton'

import classes from './deploy.scss'

const checkedIcon = <i className='icon checked icon-circle-check' />
const unCheckedIcon = <i className='icon checked icon-radio-unchecked' />

const checkboxClassNames = { ...checkboxClass, label: classes.label }

export default class DeployListItem extends Component {
  static propTypes = {
    deploy: ImmutablePropTypes.map.isRequired,
    checked: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
  }

  state = {
    showAll: false,
  }

  handleChange = (v) => {
    const { onChange, deploy } = this.props
    return onChange(deploy, v)
  }

  renderThumail () {
    const { deploy } = this.props
    const deployKey = deploy.getIn(['detail', 'publicKey'])
    return <div className={classes.thumail}>
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
  }

  render () {
    const { checked } = this.props
    return <li>
      <Checkbox classNames={checkboxClassNames}
        className={classes.item}
        rightLabel={this.renderThumail()}
        checked={checked} onChange={this.handleChange}
        checkedIcon={checkedIcon} unCheckedIcon={unCheckedIcon}
      />
    </li>
  }
}
