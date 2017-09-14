import React from 'react'
import { map } from 'react-immutable-proptypes'

import { JobLogSubscriber } from '../../Socket'

import Node from './node'

export default function JobNodeLogWrapper (props) {
  const { node } = props
  return <JobLogSubscriber node={node}>
    <Node {...props} />
  </JobLogSubscriber>
}

JobNodeLogWrapper.propTypes = {
  node: map.isRequired,
}
