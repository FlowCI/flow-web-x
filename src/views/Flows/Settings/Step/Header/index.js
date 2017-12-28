import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { Map } from 'immutable'

import Button from 'components/Buttonx'
// import IconButton from 'components/IconButton'
import Toggle from 'rc-components/Toggle'
import Input from 'rc-components/Input'

import classes from './header.scss'

export default class FlowStepHeader extends Component {
  static propTypes = {
    name: PropTypes.string,
    plugin: ImmutablePropTypes.map.isRequired,
    allowFailure: PropTypes.bool,

    save: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
  }

  static defaultProps = {
    plugin: new Map(),
  }

  state = {
    edit: false,
    name: this.props.name
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.name !== nextProps.name) {
      this.setState({ name: nextProps.name })
    }
  }

  handleAllowFailureToggle = (v) => {
    const { save } = this.props
    return save({ allowFailure: v })
  }

  handleNameChange = (v) => {
    this.setState({ name: v })
  }

  handleEdit = () => {
    this.setState({ edit: true })
  }

  handleNameSaved = () => {
    const { save, name: defaultName } = this.props
    const { name } = this.state
    if (defaultName !== name) {
      save({ name })
    }
    this.setState({ edit: false })
  }

  handleNameReset = () => {
    const { name } = this.props
    this.setState({ name, edit: false })
  }

  renderToggle (value, text, onChange) {
    return <div className={classes.toggle}>
      <Toggle className={classes.block} size='sm'
        checked={value} onChange={onChange} />
      {text}
    </div>
  }

  render () {
    const { allowFailure, plugin, remove } = this.props
    const { edit, name } = this.state
    // const name = plugin.get('name')
    const description = plugin.get('description', '')
    const href = plugin.get('source', '')

    return <div className={classes.header}>
      <span className={classes.icon}>
        <i className='icon icon-jigsaw' />
      </span>
      <div className={classes.grow}>
        <h4 className={classes.title}>
          {!edit && <span className={classes.name}>
            {name}
            <Button size='sm' className={classes.edit}
              onClick={this.handleEdit}>
              <i className='icon icon-pencil' />
            </Button>
          </span>}
          {edit && <span className={classes.name}>
            <Input value={name} size='sm' className={classes.nameInput}
              onPressEnter={this.handleNameSaved}
              onChange={this.handleNameChange} />
            <Button type='primary' size='sm'
              onClick={this.handleNameSaved}>
              保存
            </Button>
            <Button type='text' size='sm' onClick={this.handleNameReset}>
              取消
            </Button>
          </span>}
          {!!href && <a className={classes.help} href={href}
            target='_blank' rel='noopener'>
            查看帮助文档
          </a>}
        </h4>
        <div className={classes.desc}>{description}</div>
      </div>
      <div className={classes.toggles}>
        {this.renderToggle(allowFailure, '允许失败',
          this.handleAllowFailureToggle)}
      </div>
      <div className={classes.actions}>
        <Button type='danger' size='lg'
          leftIcon={<i className='icon icon-trash' />}
          className={classes.remove} onClick={remove}
        >
          删除插件
        </Button>
      </div>
    </div>
  }
}
