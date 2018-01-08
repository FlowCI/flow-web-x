import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import QRCode from 'qrcode.react'
// import ClipboardButton from 'components/ClipboardButton'
// import classnames from 'classnames'
import classes from './artifacts.scss'

export default class JobArtifact extends Component {
  static propTypes = {
    artifact: ImmutablePropTypes.contains({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }).isRequired,
  }

  render () {
    const { artifact } = this.props
    const url = artifact.get('url')
    return <div className={classes.artifact}>
      <span className={classes.qrcode} >
        <QRCode value={url} size={60} fgColor='#55575C' level='M' />
      </span>
      <div>
        <div className={classes.name}>{artifact.get('name')}</div>
        <a href={url} target='_blank' rel='noopener'>{url}</a>
      </div>
    </div>
  }
}
