import React, { Component } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'

import Artifact from './artifact'

import classes from './artifacts.scss'

export default class JobArtifacts extends Component {
  static propTypes = {
    artifacts: ImmutablePropTypes.list.isRequired,
  }

  renderEmpty () {
    return <h5 className={classes.empty}>
      本次构建时没有添加产物存储
    </h5>
  }

  render () {
    const { artifacts } = this.props
    return <div className={classes.artifacts}>
      {!artifacts.size && this.renderEmpty()}
      {artifacts.map((artifact, index) => <Artifact key={index}
        artifact={artifact} />)}
    </div>
  }
}
