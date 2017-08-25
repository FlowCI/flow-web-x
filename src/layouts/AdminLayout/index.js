import React, { Component } from 'react'
// import { node } from 'prop-types'

import Navbar from './Navbar'
export default class CoreLayout extends Component {
  static propTypes = {
    // children: node.isRequired,
  }

  render () {
    return <div>
      <Navbar />
      Hello World
    </div>
  }
}
