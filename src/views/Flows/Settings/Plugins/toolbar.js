import React, { Component } from 'react'
import PropTypes from 'prop-types'

import debounce from 'util/debounce'

import Input from 'rc-components/Input'
import {
  TabBars,
  Tab
} from 'components/TabBars'

import classes from './toolbar.scss'

export default class PluginToolbar extends Component {
  static propTypes = {
    tags: PropTypes.array.isRequired,
    current: PropTypes.any,

    /**
     * 搜索在输入框 onChange 时间后 延迟 x ms 后触发，0 为不延迟
     * not watch change
     */
    delay: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    // i18n: PropTypes.func.isRequired,
  }

  static defaultProps = {
    tags: [],
    current: '',
    delay: 300
  }

  state = {
    search: '',
  }

  constructor (props, context) {
    super(props, context)
    const { delay } = this.props
    this.doSearch = debounce((v) => {
      const { onSearch } = this.props
      onSearch(v)
    }, delay)
  }

  handleSearchChange = (v) => {
    this.setState({ search: v })
    this.doSearch(v)
  }

  renderItem (tag, value) {
    return <Tab key={tag} value={value} text={tag} />
  }

  render () {
    const { tags, current, onChange } = this.props
    const { search } = this.state
    return <div className={classes.toolbar}>
      <TabBars value={current} onChange={onChange}>
        {this.renderItem('全部', '')}
        {tags.map((tag) => this.renderItem(tag, tag))}
      </TabBars>
      <Input placeholder='搜索'
        leftIcon={<i className='icon icon-search2' />}
        value={search} onChange={this.handleSearchChange}
      />
    </div>
  }
}
