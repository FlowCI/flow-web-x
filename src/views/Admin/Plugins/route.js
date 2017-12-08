import React from 'react'
import { Route } from 'react-router'

export default function (path, store) {
  return <Route path={path} icon='icon-jigsaw' text='Plugin' navbar />
}
