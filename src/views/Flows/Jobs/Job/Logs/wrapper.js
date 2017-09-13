import React from 'react'

import { Socket } from 'views/Socket/JobLogger'
import Logs from './logs'

export default function JobLogWrapper (props) {
  return <Socket>
    <Logs {...props} />
  </Socket>
}
