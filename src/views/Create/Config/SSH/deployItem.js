import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import Checkbox from 'components/Form/Checkbox'
import Button from 'components/Buttonx'
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

  state = {
    showAll: false,
  }

  handleChange = (v) => {
    const { onChange, deploy } = this.props
    return onChange(deploy, v)
  }

  toggle = () => {
    this.setState({ showAll: !this.state.showAll })
  }

  renderThumail () {
    const { deploy } = this.props
    const deployKey = deploy.getIn(['detail', 'publicKey'])
    return <div className={classes.thumail}>
      <span>{deploy.get('name')}</span>
      <ul className={classes.actions}>
        <li>
          <Button type='text' size='sm' onClick={this.toggle}>
            显示完整内容
          </Button>
        </li>
        <li>
          <ClipboardButton className='btn-link' size='sm'
            data-clipboard-text={deployKey} />
        </li>
      </ul>
    </div>
  }

  renderDesc () {
    const { deploy } = this.props
    const deployKey = deploy.getIn(['detail', 'publicKey'])
    return <code className={classes.code}>
      {deployKey}
    </code>
  }

  render () {
    const { checked } = this.props
    const { showAll } = this.state
    return <li>
      <Checkbox className={classes.item} size='lg'
        rightLabel={this.renderThumail()}
        checked={checked} onChange={this.handleChange}
        checkedIcon={checkedIcon} unCheckedIcon={unCheckedIcon}
      />
      {showAll && this.renderDesc()}
    </li>
  }
}
