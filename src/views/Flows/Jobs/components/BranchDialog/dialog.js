import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { List } from 'immutable'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { STATUS } from 'redux-http'

import { actions } from 'redux/modules/branch'

import Modal from 'components/Modal'
import Button from 'components/Button'
import Loading from 'components/Loading'
import Cogs from 'components/Icon/Cogs'

import Item from './item'

import classes from './dialog.scss'

function mapStateToProps (state, props) {
  const { flowId } = props
  const { branch } = state
  return {
    branches: branch.getIn(['data', flowId], List()),
    loaded: branch.getIn(['ui', flowId, 'QUERY']) === STATUS.success,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    refresh: actions.query,
  }, dispatch)
}

export class BranchDialog extends Component {
  static propTypes = {
    flowId: PropTypes.string.isRequired,
    loaded: PropTypes.bool,
    branches: ImmutablePropTypes.list.isRequired,

    refresh: PropTypes.func,
    onBuild: PropTypes.func,
  }

  state = {
    building: false
  }

  handleRefresh = () => {
    const { refresh, flowId } = this.props
    return refresh(flowId)
  }

  handleBuild = (branch) => {
    const { onBuild } = this.props
    this.setState({ building: true })
    return onBuild(branch)
  }

  renderActions () {
    return <Button className='btn-default' onClick={this.handleRefresh}
      leftIcon={<i className='icon icon-running' />}
    >
      Refresh
    </Button>
  }

  renderLoading () {
    return <div className={classes.loading}>
      <Loading />
    </div>
  }

  renderContent () {
    const { loaded, branches } = this.props
    if (!loaded) {
      return this.renderLoading()
    }
    return <ul className={classes.list}>
      {branches.map((b) => <Item key={b} branch={b}
        onBuild={this.handleBuild} />)}
    </ul>
  }

  renderCogs () {
    return <div className={classes.cogs}>
      <Cogs />
    </div>
  }

  render () {
    const { building } = this.state
    return <Modal {...this.props} title='选择构建分支'
      footer={!building ? this.renderActions() : undefined}>
      {!building ? this.renderContent() : this.renderCogs()}
    </Modal>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BranchDialog)
