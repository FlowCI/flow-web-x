import { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const basePath = '/topic/cmd'

/**
 *
 * @param {object} node job node module
 * @param {string} message 日志内容
 */
function log (node, message) {
  console.log(node, message)
  return {
    type: 'onmessage'
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    dispatchMessage: log,
  }, dispatch)
}

export class JobLoggerSubscriber extends Component {
  static propTypes = {
    /**
     * job node module
     */
    node: PropTypes.shape({
      cmdId: PropTypes.string.isRequired
    }).isRequired,

    children: PropTypes.node.isRequired,
    /**
     * function (node, string) {}
     */
    dispatchMessage: PropTypes.func.isRequired,
  }

  static contextTypes = {
    jobLoggerClient: PropTypes.object,
  }

  /**
   * 暂时先 didmount 时发起订阅，等之后加上状态推送后改为根据状态来订阅
   */
  componentDidMount () {
    const { jobLoggerClient: client } = this.context
    const { node, dispatchMessage } = this.props
    const { cmdId } = node
    this.subscription = client.subscribe(`${basePath}/${cmdId}`, function (data) {
      dispatchMessage(node, data.body)
    })
  }

  componentWillUnmount () {
    this.subscription.unsubscribe()
  }

  render () {
    const { children } = this.props
    return children
  }
}

connect(undefined, mapDispatchToProps)(JobLoggerSubscriber)
