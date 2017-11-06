import React from 'react'
import { api } from 'util/constant'
import { Socket } from 'packages/socket'

const url = `${api}/ws/web`

export default function WebSocket (props) {
  return <Socket {...props} url={url} />
}
