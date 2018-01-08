import React, { Component } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'

import Artifact from './artifact'

import classes from './artifacts.scss'

export default class JobArtifacts extends Component {
  static propTypes = {
    artifacts: ImmutablePropTypes.list.isRequired,
  }

  render () {
    const { artifacts } = this.props
    return <div className={classes.artifacts}>
      {artifacts.map((artifact, index) => <Artifact key={index}
        artifact={artifact} />)}
    </div>
  }
}
