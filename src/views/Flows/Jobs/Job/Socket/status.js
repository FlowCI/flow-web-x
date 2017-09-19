import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { contains } from 'react-immutable-proptypes'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'redux/modules/job'

import { Subscriber } from 'packages/socket'

const baseChanel = '/topic/job'

function mapStateToProps (state, props) {
  const { jobId } = props
  return {
    job: state.job.getIn(['data', jobId]),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    onMessage: actions.storeJob,
  }, dispatch)
}

export class JobStatusSubscriber extends Component {
  static propTypes = {
    job: contains({
      /**
       * 实际上为 ${nodePath}-${number} 其值刚好等于 id
       */
      id: PropTypes.string.isRequired,
    }).isRequired,
    onMessage: PropTypes.func.isRequired,
  }

  constructor (props, context) {
    super(props, context)
    const { job } = this.props
    this.state = {
      chanel: `${baseChanel}/${job.get('id')}`
    }
  }

  handleMessage = ({ body }) => {
    const { onMessage } = this.props
    return onMessage(JSON.parse(body))
  }

  render () {
    const { chanel } = this.state
    return <Subscriber {...this.props} chanel={chanel}
      onMessage={this.handleMessage} />
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(JobStatusSubscriber)
