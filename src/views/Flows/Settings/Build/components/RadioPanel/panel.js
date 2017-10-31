import React, { Component } from 'react'
import PropTypes from 'prop-types'

import RadioGroups from 'components/Form/RadioGroups'
import Radio from 'components/Form/Radio'
import Panel from '../Panel'

import classes from './panel.scss'
export default class FlowBuildSettingRadioPanel extends Component {
  static propTypes = {
    enabled: PropTypes.bool,
    filter: PropTypes.string,
  }

  state = {
    radioValue: this.props.filter === '*' ? '*' : '-',
    filter: this.props.filter,
  }

  handleRadioChange = (value) => {
    this.setState({ radioValue: value })
  }

  render () {
    const { radioValue } = this.state
    const { enabled } = this.props
    return <Panel {...this.props}>
      {enabled && <RadioGroups value={radioValue} onChange={this.handleRadioChange}>
        <Radio rightLabel='所有分支' value='*' />
        <Radio rightLabel='正则匹配' value='-' />
      </RadioGroups>}
      {enabled && radioValue !== '*' && <textarea className={classes.editor} />}
    </Panel>
  }
}
