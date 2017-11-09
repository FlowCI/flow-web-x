import React, { Component } from 'react'
import { node } from 'prop-types'

import DocumentTitle from 'react-document-title'

import AlertControl from '../components/AlertControl'
import Socket from './Socket'

export default class CoreLayout extends Component {
  static propTypes = {
    children: node.isRequired,
  }

  render () {
    const { children } = this.props
    return <DocumentTitle title='flow.ci'>
      <div style={{ height: '100%' }}>
        <AlertControl />
        <Socket>
          {children}
        </Socket>
      </div>
    </DocumentTitle>
  }
}
