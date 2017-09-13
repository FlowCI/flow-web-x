import React, { Component } from 'react'
import { string, func } from 'prop-types'
import { contains } from 'react-immutable-proptypes'

import { connect } from 'react-redux'

import { Subscribe } from 'views/Socket/JobLogger'
import Header from './header'
import Content from './content'

function mapStateToProps (state, props) {
  const { node } = state
  const { jobId, nodeId } = props
  return {
    node: node.getIn([jobId, 'data', `${nodeId}`])
  }
}

export class JobNode extends Component {
  static propTypes = {
    node: contains({
      status: string.isRequired,
      name: string.isRequired,
    }).isRequired,
    onExpended: func,
  }

  state = {
    expended: false,
  }

  toggle = () => {
    const { onExpended } = this.props
    const { expended } = this.state
    if (!expended) {
      onExpended()
    }
    this.setState({ expended: !expended })
  }

  render () {
    const { node } = this.props
    const { expended } = this.state
    return <Subscribe node={node}>
      <div>
        <Header expended={expended} name={node.get('name')}
          status={node.get('status')} onClick={this.toggle}
        />
        {expended && <Content />}
      </div>
    </Subscribe>
  }
}

export default connect(mapStateToProps)(JobNode)
