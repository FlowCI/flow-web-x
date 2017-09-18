import React, { Component } from 'react'
import { string, func, bool } from 'prop-types'
import { contains } from 'react-immutable-proptypes'

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
