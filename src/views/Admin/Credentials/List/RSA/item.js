import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { map } from 'react-immutable-proptypes'

import moment from 'moment'

import ClipboardButton from 'components/ClipboardButton'
import IconButton from 'components/IconButton'

import {
  ListRow,
  ListCol,
} from '../../../components/List'

import classes from './rsa.scss'

export default class RSACredentialItem extends Component {
  static propTypes = {
    credential: map.isRequired,
    remove: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  handleRemove = () => {
    const { credential, remove } = this.props
    return remove(credential)
  }

  render () {
    const { credential, i18n } = this.props
    const finger = credential.getIn(['detail', 'publicKey'])

    return <ListRow>
      <ListCol>{credential.get('name')}</ListCol>
      <ListCol>{credential.get('createdBy')}</ListCol>
      <ListCol>
        {moment(credential.get('createdAt') * 1000).format('YYYY.M.D')}
      </ListCol>
      <ListCol>
        <div className={classes.wrapper}>
          <span>{finger}</span>
          <ClipboardButton data-clipboard-text={finger} i18n={i18n}
            className={classes.copy}
          />
        </div>
      </ListCol>
      <ListCol>
        <IconButton onClick={this.handleRemove} className={classes.remove}>
          <i className='icon icon-trash' />
        </IconButton>
      </ListCol>
    </ListRow>
  }
}
