import React from 'react'

import { JobSocket } from '../Socket'
import Logs from './logs'

export default function JobLogWrapper (props) {
  return <JobSocket>
    <Logs {...props} />
  </JobSocket>
}
