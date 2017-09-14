import React from 'react'

import { Socket } from 'packages/socket'

const url = `${__API__}/ws/web`

export default function JobSocket (props) {
  return <Socket {...props} url={url} />
}
