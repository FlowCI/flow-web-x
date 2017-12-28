import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { generatorJobId, actions } from 'redux/modules/job'

import Code from 'components/Code'

function mapStateToProps (state, props) {
  const { job } = state
  const { params: { jobNumber, flowId, } } = props

  const jobId = generatorJobId(flowId, jobNumber)
  return {
    flowId,
    jobNumber,
    yml: job.getIn(['yml', jobId]),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    getYml: actions.getYml,
  }, dispatch)
}

export class JobYml extends Component {
  static propTypes = {
    flowId: PropTypes.string,
    jobNumber: PropTypes.string,

    yml: PropTypes.string,
    getYml: PropTypes.func.isRequired
  }

  componentDidMount () {
    const { getYml, flowId, jobNumber } = this.props
    getYml(flowId, jobNumber)
  }

  render () {
    const { yml } = this.props
    return <div>
      <Code className='code black' code={yml} />
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(JobYml)
