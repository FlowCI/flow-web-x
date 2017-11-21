import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { List } from 'immutable'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { STATUS } from 'redux-http'

import { actions } from 'redux/modules/job'
import { actions as branchActions } from 'redux/modules/branch'

import { Select, Option } from 'rc-components/Select'
import Checkbox from 'rc-components/Checkbox'
import Input from 'rc-components/Input'

import classes from './filter.scss'

function mapStateToProps (state, props) {
  const { branch, job } = state
  const { flowId } = props

  const status = branch.getIn(['ui', 'QUERY'])
  const filter = job.getIn(['ui', 'filter'], {})

  return {
    branches: branch.getIn(['data', flowId], new List()),

    branch: filter.branch,
    keyword: filter.keyword,
    onlySelf: !!filter.onlySelf,
    pullRequest: !!filter.pullRequest,

    loading: status === STATUS.send,
    loaded: status === STATUS.success,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    setFilter: actions.setFilter,
    freedFilter: actions.freedFilter,
    queryBranches: branchActions.query,
  }, dispatch)
}

export class JobsFilter extends Component {
  static propTypes = {
    flowId: PropTypes.string.isRequired,
    branch: PropTypes.string,
    keyword: PropTypes.string,
    onlySelf: PropTypes.bool,
    pullRequest: PropTypes.bool,

    branches: ImmutablePropTypes.list.isRequired,
    loading: PropTypes.bool,
    loaded: PropTypes.bool,

    queryBranches: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
    freedFilter: PropTypes.func.isRequired,
  }

  static defaultProps = {
    branch: '',
  }

  state = {
    keyword: this.props.keyword || ''
  }

  componentDidMount () {
    const { flowId, loading, loaded, queryBranches, } = this.props
    if (!loading && !loaded) {
      queryBranches(flowId)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.keyword !== nextProps.keyword) {
      this.setState({ keyword: nextProps.keyword })
    }
  }

  componentWillUnmount () {
    clearTimeout(this.keywordTimer)
    const { freedFilter } = this.props
    freedFilter()
  }

  saveFilter (name, value) {
    const { branch, onlySelf, pullRequest, setFilter } = this.props
    const { keyword } = this.state
    const filter = { branch, onlySelf, pullRequest, keyword }
    filter[name] = value
    setFilter(filter)
  }

  handleBranch = (v) => {
    this.saveFilter('branch', v)
  }

  handleOnlySelfCheck = (checked) => {
    this.saveFilter('onlySelf', checked)
  }

  handlePullRequestCheck = (checked) => {
    this.saveFilter('pullRequest', checked)
  }

  handleKeyword = (v) => {
    clearTimeout(this.keywordTimer)
    this.setState({ 'keyword': v })
    /**
     * save state 为异步，300ms 中包含异步时间.
     */
    this.keywordTimer = setTimeout(this.saveKeyword, 300)
  }

  saveKeyword = () => {
    this.saveFilter('keyword', this.state.keyword)
  }

  render () {
    const {
      loading, branches,
      branch, onlySelf,
      pullRequest,
    } = this.props
    const { keyword } = this.state
    return <div className={classes.filter}>
      <Select loading={loading} value={branch}
        onChange={this.handleBranch}
        leftIcon={<i className='icon icon-git-branch' />}>
        <Option value=''>全部分支</Option>
        {branches.map((b) => <Option key={b} label={b} value={b} />)}
      </Select>
      <Input placeholder='输入关键词搜索' value={keyword}
        onChange={this.handleKeyword} />
      <Checkbox label='只查看我的提交' checked={onlySelf}
        onChange={this.handleOnlySelfCheck} />
      <Checkbox label='Pull Request' checked={pullRequest}
        onChange={this.handlePullRequestCheck} />
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(JobsFilter)
