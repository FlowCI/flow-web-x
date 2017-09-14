import React, { Component } from 'react'
import { string, func, bool } from 'prop-types'
import { contains } from 'react-immutable-proptypes'

import { connect } from 'react-redux'

import { STATUS } from 'redux-http'

import { Subscribe } from 'views/Socket/JobLogger'
import Header from './header'
import Content from './content'

function mapStateToProps (state, props) {
  const { node } = state
  const { jobId, nodeId } = props
  const nodeState = node.get(jobId)
  return {
    node: nodeState.getIn(['data', nodeId]),
    log: nodeState.getIn(['log', nodeId]),
    fetching: nodeState.getIn(['ui', 'GET_LOG']) !== STATUS.success,
  }
}

export class JobNode extends Component {
  static propTypes = {
    node: contains({
      status: string.isRequired,
      name: string.isRequired,
    }).isRequired,
    log: string,
    fetching: bool,
    onExpended: func,
  }

  state = {
    expended: false,
  }

  toggle = () => {
    const { onExpended } = this.props
    const { expended } = this.state
    if (!expended) {
      onExpended && onExpended()
    }
    this.setState({ expended: !expended })
  }

  render () {
    const { node, fetching, log } = this.props
    const { expended } = this.state
    return <Subscribe node={node}>
      <div>
        <Header expended={expended} name={node.get('name')}
          status={node.get('status')} onClick={this.toggle}
        />
        {expended && <Content onClose={this.toggle} log={log}
          fetching={fetching} />}
        <hr />
      </div>
    </Subscribe>
  }
}

export default connect(mapStateToProps)(JobNode)
