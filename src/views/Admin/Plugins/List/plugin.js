import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { Ul, Li } from 'components/InlineUl'

import classnames from 'classnames'
import classes from './plugin.scss'

export default class Plugin extends Component {
  static propTypes = {
    plugin: ImmutablePropTypes.map.isRequired,
    /**
     * 设置 是否启用 function (plugin: Plugin, enabled: bool) {}
     */
    toggle: PropTypes.func,
    /**
     * 删除 plugin function (plugin: Plugin) {}
     */
    remove: PropTypes.func,
    upgrade: PropTypes.func,
    i18n: PropTypes.func.isRequired,
  }

  setDisabled = () => {
    const { plugin, toggle } = this.props
    return toggle && toggle(plugin, false)
  }

  setEnabled = () => {
    const { plugin, toggle } = this.props
    return toggle && toggle(plugin, true)
  }

  handleRemove = () => {
    const { plugin, remove } = this.props
    remove && remove(plugin)
  }

  handleUpgrade = () => {
    const { upgrade, plugin } = this.props
    upgrade && upgrade(plugin)
  }

  renderActions (enabled) {
    return <Ul className={classes.actions}>
      {enabled && <Li><a onClick={this.setDisabled}
        className={classes.grey}>
        停用
      </a></Li>}
      {!enabled && <Li><a onClick={this.setEnabled}>启用</a></Li>}
      {!enabled && <Li><a onClick={this.handleRemove}>删除</a></Li>}
    </Ul>
  }

  renderName () {
    const { plugin } = this.props
    const enabled = plugin.get('enabled')
    return <div className={classes.plugin}>
      <h5 className={classnames(classes.strong, classes.name)}>
        {plugin.get('name')}
      </h5>
      {this.renderActions(enabled)}
    </div>
  }

  renderDesc () {
    const { plugin } = this.props
    const tags = plugin.get('tags')
    return <div className={classes.desc}>
      <h5 className={classes.strong}>{plugin.get('desc')}</h5>
      <Ul className={classes.tags}>
        <Li>版本: {plugin.get('version')}</Li>
        {tags.map((t) => <Li key={t}>{t}</Li>)}
        <Li>
          <a href={plugin.get('link')} target='_blank'>使用帮助</a>
        </Li>
      </Ul>
    </div>
  }

  renderPlugin () {
    return <div className={classes.item}>
      <div className={classes.icon}>
        <i className='icon icon-jigsaw' />
      </div>
      {this.renderName()}
      {this.renderDesc()}
    </div>
  }

  renderUpdateInfo () {
    const name = this.props.plugin.get('name')
    return <div className={classes.update}>
      {name} 有新版本可用。<a href='http://baidu.com' target='_blank'>
        查看详情
      </a> 或 <a
        onClick={this.handleUpgrade}>
        现在更新
      </a>
    </div>
  }

  render () {
    const { plugin } = this.props
    const version = plugin.get('version')
    const lastest = plugin.get('lastest')
    if (lastest && lastest !== version) {
      return <div className={classes.itemGroup}>
        {this.renderPlugin()}
        {this.renderUpdateInfo()}
      </div>
    }
    return this.renderPlugin()
  }
}
