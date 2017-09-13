import { Component } from 'react'
import PropTypes from 'prop-types'
import { contains } from 'react-immutable-proptypes'

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
    node: contains({
      cmdId: PropTypes.string.isRequired,
      jobId: PropTypes.string.isRequired,
      order: PropTypes.number.isRequired,
    }).isRequired,

    children: PropTypes.node.isRequired,
    /**
     * function (node, string) {}
     */
    dispatchMessage: PropTypes.func.isRequired,
  }

  static contextTypes = {
    subscribe: PropTypes.func.isRequired,
  }

  /**
   * 暂时先 didmount 时发起订阅，等之后加上状态推送后改为根据状态来订阅
   */
  componentDidMount () {
    const { subscribe } = this.context
    const { node, dispatchMessage } = this.props
    const cmdId = node.get('cmdId')
    this.subscription = subscribe(`${basePath}/${cmdId}`, function (data) {
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

export default connect(undefined, mapDispatchToProps)(JobLoggerSubscriber)
