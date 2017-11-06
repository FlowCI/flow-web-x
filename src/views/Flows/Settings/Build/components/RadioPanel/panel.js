import React, { Component } from 'react'
import PropTypes from 'prop-types'

import RadioGroups from 'components/Form/RadioGroups'
import Radio from 'components/Form/Radio'
import Button from 'components/Button'

import Panel from '../Panel'
import classes from './panel.scss'
export default class FlowBuildSettingRadioPanel extends Component {
  static propTypes = {
    enabled: PropTypes.bool,
    filter: PropTypes.string,
    defaultFilter: PropTypes.string,
    onSave: PropTypes.func.isRequired,
  }

  static defaultProps = {
    defaultFilter: '*',
  }

  state = {
    radioValue: this.props.filter === '*' ? '*' : '-',
    filter: this.props.filter,
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.filter !== nextProps.filter) {
      this.setState({ filter: nextProps.filter })
    }
  }

  handleRadioChange = (value) => {
    const all = value === '*'
    this.setState({
      radioValue: value,
      filter: all ? '*' : this.props.defaultFilter,
    }, this.handleSave)
  }

  handleFilterChange = (e) => {
    this.setState({ filter: e.target.value })
  }

  handleSave = () => {
    const { onSave } = this.props
    onSave(this.state.filter)
  }

  render () {
    const { radioValue, filter } = this.state
    const { enabled } = this.props
    return <Panel {...this.props}>
      {enabled && <RadioGroups value={radioValue} onChange={this.handleRadioChange}>
        <Radio rightLabel='所有分支' value='*' />
        <Radio rightLabel='正则匹配' value='-' />
      </RadioGroups>}
      {enabled && radioValue !== '*' && <textarea className={classes.editor}
        value={filter} onChange={this.handleFilterChange} />}
      {enabled && radioValue !== '*' && <Button className='btn-primary' disabled={filter === this.props.filter}
        onClick={this.handleSave}
      >
        保存
      </Button>}
    </Panel>
  }
}
