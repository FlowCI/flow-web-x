import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { List } from 'immutable'
import debounce from 'util/debounce'

import { Labels, Label } from '../Labels'
import Input from 'rc-components/Input'

import classes from './toolbar.scss'

export default class FlowAddPluginToolbar extends Component {
  static propTypes = {
    delay: PropTypes.number.isRequired,
    tags: ImmutablePropTypes.list.isRequired,
    current: PropTypes.string,

    onTagChange: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    delay: 300,
    tags: new List(),
  }

  state = {
    text: '',
  }

  constructor (props, context) {
    super(props, context)
    const { delay } = this.props
    this.doSearch = debounce((v) => {
      const { onSearch } = this.props
      onSearch(v)
    }, delay)
  }

  handleTextChange = (v) => {
    this.setState({ text: v })
    this.doSearch(v)
  }

  handleLabelChange = (v) => {
    const { onTagChange } = this.props
    onTagChange(v === '*' ? '' : v)
  }

  render () {
    const { tags, current } = this.props
    const { text } = this.state

    return <div className={classes.toolbar}>
      <Labels value={current || '*'} onChange={this.handleLabelChange}>
        <Label value='*' text='全部' />
        {tags.map((tag) => <Label key={tag} value={tag} text={tag} />)}
      </Labels>
      <Input leftIcon={<i className='icon icon-search2' />}
        value={text} onChange={this.handleTextChange}
      />
    </div>
  }
}
