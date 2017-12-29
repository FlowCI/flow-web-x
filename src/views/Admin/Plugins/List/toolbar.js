import React, { Component } from 'react'
import PropTypes from 'prop-types'

import debounce from 'util/debounce'

import Input from 'rc-components/Input'
import {
  TabBars,
  Tab
} from 'components/TabBars'
import Toolbar from '../../components/Toolbar'

import classes from './toolbar.scss'

export default class PluginToolBar extends Component {
  static propTypes = {
    category: PropTypes.string.isRequired,
    counts: PropTypes.shape({
      ALL: PropTypes.number,
      ENABLED: PropTypes.number,
      DISABLED: PropTypes.number,
      UPDATEABLED: PropTypes.number,
    }).isRequired,
    delay: PropTypes.number,

    onChange: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  static defaultProps = {
    delay: 300,
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

  renderItem (category, counts) {
    const { i18n } = this.props
    const text = i18n(category, { count: counts[category] || 0 })
    return <Tab value={category} text={text} />
  }

  render () {
    const { category, counts, onChange } = this.props
    const { search } = this.state
    return <Toolbar className={classes.toolbar}>
      <TabBars value={category} onChange={onChange}>
        {this.renderItem('ALL', counts)}
        {this.renderItem('ENABLED', counts)}
        {this.renderItem('DISABLED', counts)}
        {this.renderItem('UPDATEABLED', counts)}
      </TabBars>
      <Input placeholder='搜索'
        leftIcon={<i className='icon icon-search2' />}
        value={search} onChange={this.handleSearchChange}
      />
    </Toolbar>
  }
}
