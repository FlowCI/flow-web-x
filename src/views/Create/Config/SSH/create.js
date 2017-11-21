import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Button from 'components/Buttonx'
import Input from 'rc-components/Input'

import ClickAwayListener from 'components/ClickAwayListener'

import classes from './create.scss'

const closeIcon = <i className='icon icon-cross' />

export default class CreateDeployPopover extends Component {
  static propTypes = {
    onCreate: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  state = {
    opened: false,
    name: ''
  }

  componentDidMount () {
    this.isMount = true
  }

  componentWillUnmount () {
    this.isMount = false
  }

  handleClick = () => {
    this.setState({ opened: !this.state.opened })
  }

  handleClosePanel = () => {
    this.setState({ opened: false, name: '' })
  }

  handleNameChange = (v) => {
    this.setState({ name: v })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { name } = this.state
    const { onCreate } = this.props
    return onCreate(name).then(() => {
      if (this.isMount) {
        this.handleClosePanel()
      }
    })
  }

  renderDialog () {
    const { name } = this.state
    const enabled = !!name
    return <ClickAwayListener onClickAway={this.handleClosePanel}>
      <form className={classes.panel}>
        <span className={classes.close} onClick={this.handleClosePanel}>
          {closeIcon}
        </span>
        <h5 className={classes.title}>生成 Deploy Key</h5>
        <div className={classes.field}>
          <Input value={name} onChange={this.handleNameChange}
            className='block' placeholder='输入 key 名称' />
        </div>
        <Button htmlType='submit' type='primary'
          disabled={!enabled} onClick={this.handleSubmit}>
          生成
        </Button>
      </form>
    </ClickAwayListener>
  }

  render () {
    const { i18n } = this.props
    const { opened } = this.state
    return <div className={classes.popover}>
      <Button type='text' size='sm' onClick={this.handleClick}>
        {i18n('新建一个')}
      </Button>
      {opened && this.renderDialog()}
    </div>
  }
}
