import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { Map } from 'immutable'

import Button from 'components/Buttonx'
import Toggle from 'rc-components/Toggle'

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

  handleAllowFailureToggle = (v) => {
    const { save } = this.props
    return save({ allowFailure: v })
  }

  handleNameChange = (v) => {
    const { save } = this.props
    return save({ name: v })
  }

  renderToggle (value, text, onChange) {
    return <div className={classes.toggle}>
      <Toggle className={classes.block} size='sm'
        checked={value} onChange={onChange} />
      {text}
    </div>
  }

  render () {
    const { name, allowFailure, plugin, remove } = this.props
    // const name = plugin.get('name')
    const description = plugin.get('description', '')
    const href = plugin.get('source', '')

    return <div className={classes.header}>
      <span className={classes.icon}>
        <i className='icon icon-jigsaw' />
      </span>
      <div className={classes.grow}>
        <h4 className={classes.name}>
          {name}
          {!!href && <a className={classes.help} href={href}
            target='_blank' rel='noopener'>
            查看帮助文档
          </a>}
        </h4>
        <div className={classes.desc}>{description}</div>
      </div>
      <div className={classes.toggles}>
        {this.renderToggle(allowFailure, '禁用插件',
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
