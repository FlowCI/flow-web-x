import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Input from 'rc-components/Input'
import {
  TabBars,
  Tab
} from '../../components/TabBars'
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
    onChange: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  state = {
    search: '',
  }

  handleSearchChange = (v) => {
    this.setState({ search: v })
    const { onSearch } = this.props
    onSearch(v)
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
