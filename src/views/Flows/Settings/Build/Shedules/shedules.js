import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { Map, List } from 'immutable'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { STATUS } from 'redux-http'

import { actions } from 'redux/modules/flow'
import { actions as branchActions } from 'redux/modules/branch'

import { Select, Option } from 'components/Form/Select'
import Input from 'components/Form/Input'
import Button from 'components/Button'

import classes from './shedules.scss'

function mapStateToProps (state, props) {
  const { flowId } = props
  const { flow, branch } = state

  const f = flow.getIn(['data', flowId], new Map())
  const status = branch.getIn(['ui', 'QUERY'])
  return {
    branch: f.getIn(['envs', 'FLOW_TASK_CRONTAB_BRANCH']),
    content: f.getIn(['envs', 'FLOW_TASK_CRONTAB_CONTENT']),
    branches: branch.getIn(['data', flowId], List()),
    querying: status === STATUS.send,
    queryed: status === STATUS.success,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    queryBranches: branchActions.query,
    updateEnv: actions.updateEnv,
    removeEnv: actions.removeEnv,
  }, dispatch)
}

export class FlowShedulesSetting extends Component {
  static propTypes = {
    flowId: PropTypes.string.isRequired,
    branch: PropTypes.string,
    content: PropTypes.string,
    branches: ImmutablePropTypes.list.isRequired,

    querying: PropTypes.bool,
    queryed: PropTypes.bool,

    queryBranches: PropTypes.func.isRequired,
    updateEnv: PropTypes.func.isRequired,
    removeEnv: PropTypes.func.isRequired,
    // i18n: PropTypes.func.isRequired,
  }

  state = {
    edit: !this.props.branch,
    values: {
      branch: this.props.branch,
      content: this.props.content,
    },
  }

  componentDidMount () {
    const { flowId, querying, queryed, queryBranches } = this.props
    if (!querying && !queryed) {
      queryBranches(flowId)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.branch !== this.props.branch ||
      nextProps.content !== this.props.content) {
      this.setState({
        edit: !nextProps.branch,
        values: {
          branch: nextProps.branch,
          content: nextProps.content,
        }
      })
    }
  }

  handleEdit = () => {
    this.setState({ edit: true })
  }

  handleBranchChange = (b) => {
    this.setState({ values: { ...this.state.values, branch: b } })
  }

  handleContentChange = (v) => {
    this.setState({ values: { ...this.state.values, content: v } })
  }

  handleSave = () => {
    const { updateEnv, flowId, branch: b, content: c } = this.props
    const { values: { branch, content } } = this.state
    if (!branch) {
      return
    }
    if (b === branch && c === content) {
      this.setState({ edit: false })
      return
    }
    return updateEnv(flowId, {
      FLOW_TASK_CRONTAB_BRANCH: branch,
      FLOW_TASK_CRONTAB_CONTENT: content,
    })
  }

  handleRemove = () => {
    const { removeEnv, flowId } = this.props
    return removeEnv(flowId, [
      'FLOW_TASK_CRONTAB_BRANCH',
      'FLOW_TASK_CRONTAB_CONTENT'
    ])
  }

  renderActions () {
    const { branch } = this.props
    const { edit } = this.state
    const actions = []
    if (edit) {
      actions.push(<Button key='save' className='btn-primary'
        onClick={this.handleSave}>
        保存
      </Button>)
    } else if (branch) {
      actions.push(<Button key='edit' onClick={this.handleEdit}>编辑</Button>)
    }
    if (branch) {
      actions.push(<Button key='remove' className='btn-danger'
        onClick={this.handleRemove}>
        删除
      </Button>)
    }
    return <div className={classes.actions}>
      {actions}
    </div>
  }

  render () {
    const { branches, querying } = this.props
    const { edit, values: { branch, content } } = this.state
    return <div className={classes.schdules}>
      <Select className={classes.control} loading={querying}
        placeholder='选择项目分支' disabled={!edit}
        value={branch || ''} onChange={this.handleBranchChange}>
        {branches.map((b) => <Option key={b} value={b} title={b} />)}
      </Select>
      <Input className={classes.control} placeholder='填写 crontab 命令'
        value={content || ''} disabled={!edit}
        onChange={this.handleContentChange} />
      {this.renderActions()}
    </div>
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(FlowShedulesSetting)
