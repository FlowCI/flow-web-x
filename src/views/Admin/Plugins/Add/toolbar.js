import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Input from 'rc-components/Input'
import {
  TabBars,
  Tab
} from '../../components/TabBars'
import Toolbar from '../../components/Toolbar'

import classes from './toolbar.scss'

export default class AddPluginToolBar extends Component {
  static propTypes = {
    tags: PropTypes.array.isRequired,
    current: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    // i18n: PropTypes.func.isRequired,
  }

  static defaultProps = {
    tags: ['单元测试', '消息通知', '数据库'],
    current: '全部'
  }

  state = {
    search: '',
  }

  handleSearchChange = (v) => {
    this.setState({ search: v })
    const { onSearch } = this.props
    onSearch(v)
  }

  renderItem (tag) {
    return <Tab key={tag} value={tag} text={tag} />
  }

  render () {
    const { tags, current, onChange } = this.props
    const { search } = this.state
    return <Toolbar className={classes.toolbar}>
      <TabBars value={current} onChange={onChange}>
        {this.renderItem('全部')}
        {tags.map((tag) => this.renderItem(tag))}
      </TabBars>
      <Input placeholder='搜索'
        leftIcon={<i className='icon icon-search2' />}
        value={search} onChange={this.handleSearchChange}
      />
    </Toolbar>
  }
}
