import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { connect } from 'react-redux'

function mapStateToProps (state, { id }) {
  const { job } = state
  return {
    job: job.getIn(['data', id])
  }
}

export class JobStatusHeader extends Component {
  static propTypes = {
    job: ImmutablePropTypes.map,
    i18n: PropTypes.func.isRequired,
  }

  render () {
    return <div>Hello World</div>
  }
}

export default connect(mapStateToProps)(JobStatusHeader)
