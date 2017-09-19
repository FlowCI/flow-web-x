import React, { Component } from 'react'
import { string, func, bool } from 'prop-types'
import { contains } from 'react-immutable-proptypes'

import { is } from 'util/nodeStatus'

import Header from './header'
import Content from './content'

export default class JobNode extends Component {
  static propTypes = {
    node: contains({
      status: string.isRequired,
      name: string.isRequired,
    }).isRequired,
    log: string,
    fetching: bool,
    getLog: func,
    onExpended: func,
  }

  state = {
    expended: false,
  }

  componentDidMount () {
    const { node } = this.props
    if (is.failure(node.get('status')) || is.running(node.get('status'))) {
      this.toggle()
    }
  }

  componentWillReceiveProps (nextProps) {
    const { node } = this.props
    const { node: nextNode } = nextProps
    const ns = nextNode.get('status')
    if (node !== nextNode && node.get('status') !== ns) {
      console.log('status', ns)
      if (is.running(ns)) {
        if (!this.state.expended) {
          this.toggle(nextProps)
        }
      } else if (is.finish(ns)) {
        const { getLog } = this.props
        getLog && getLog(nextNode)
      }
    }
  }

  toggle = (props = this.props) => {
    const { onExpended, node } = props
    const { expended } = this.state
    if (!expended) {
      onExpended && onExpended(node)
    }
    this.setState({ expended: !expended })
  }

  render () {
    const { node, fetching, log } = this.props
    const { expended } = this.state
    return <div>
      <Header expended={expended} name={node.get('name')}
        status={node.get('status')} toggle={this.toggle}
      />
      {expended && <Content onClose={this.toggle} log={log}
        fetching={fetching} />}
      <hr />
    </div>
  }
}
