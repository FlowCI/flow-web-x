import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'

import Input from 'components/Form/Input'
import Radio from 'components/Form/Radio'
import RadioGroups from 'components/Form/RadioGroups'
import { Checkbox } from 'components/Form'
import { Select, Option } from 'components/Form/Select'
import AutoComplete from 'components/Form/AutoComplete'
import Button from 'components/Button'

import createI18n from './i18n'

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    redirect: push
  }, dispatch)
})

class HomeView extends PureComponent {
  static propTypes = {
    redirect: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  static defaultProps = {
    i18n: createI18n('zh-cn')
  }

  state = {
    checked: false,
    filter: '',
    radio: '',
  }

  goNext = () => {
    const { redirect } = this.props
    redirect('/next')
  }

  handleCheck = (checked) => {
    this.setState({ checked: checked })
  }

  handleRadio = (e) => {
    this.setState({ radio: e.target.value })
  }

  handleSelect = (v) => {
    this.setState({ selected: v })
  }

  handleFilterChange = (v) => {
    this.setState({ filter: v })
  }

  render () {
    const { i18n } = this.props
    const { checked, selected, radio, filter } = this.state
    return <div>
      {i18n('text')}
      <input placeholder='输入关键词搜索' />
      <button className='btn btn-inverse' onClick={this.goNext}>
        <span>to next view</span>
      </button>
      <br />
      <Button className='btn-default' loading
        rightIcon={<i className='icon icon-xxx' />}
      >
        This is an button
      </Button>
      <Input
        leftIcon={<i className='icon icon-search' />}
        placeholder='输入关键词搜索' />
      <Checkbox rightLabel='只查看我的提交'
        onChange={this.handleCheck}
        checked={checked} />
      <RadioGroups onChange={this.handleRadio} value={radio}>
        <Radio rightLabel='只查看我的提交' value='me'
          onChange={this.handleCheck}
          checked={checked} />
        <Radio rightLabel='只查看他人的提交' value='other'
          onChange={this.handleCheck}
          checked={checked} />
        <Radio rightLabel='查看所有提交' value='all'
          onChange={this.handleCheck}
          checked={checked} />
      </RadioGroups>
      <Select placeholder='输入关键词搜索'
        value={selected}
        onChange={this.handleSelect}>
        <Option value='1' disabled>option 1</Option>
        <Option value='2'>option 2</Option>
        <Option value='3'>option 3</Option>
      </Select>
      <AutoComplete placeholder='输入关键词搜索' value={filter}
        notFoundContent='cant found option'
        onFilterChange={this.handleFilterChange} dataSource={[{
          title: 'aa option 1',
          value: '1'
        }, {
          title: 'bb option 2',
          value: '2'
        }, {
          title: 'cc option 3',
          value: '3'
        }]} />
    </div>
  }
}

export default connect(undefined, mapDispatchToProps)(HomeView)
