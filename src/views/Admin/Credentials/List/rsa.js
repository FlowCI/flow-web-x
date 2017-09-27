import React, { Component } from 'react'
import { func } from 'prop-types'
import { list } from 'react-immutable-proptypes'

import { connect } from 'react-redux'

import createI18n from '../i18n'
import language from 'util/language'

import moment from 'moment'

import ClipboardButton from 'components/ClipboardButton'

import {
  List,
  ListHead,
  ListHeadCol,
  ListBody,
  ListRow,
  ListCol,
} from '../../components/List'

import classes from './rsa.scss'

function mapStateToProps (state, props) {
  const { credential } = state
  return {
    credentials: credential.get('RSA'),
  }
}

export class RSACredentialList extends Component {
  static propTypes = {
    credentials: list.isRequired,
    i18n: func.isRequired,
  }

  static defaultProps = {
    i18n: createI18n(language).createChild('list.rsa'),
  }

  renderItem = (credential) => {
    const { i18n } = this.props
    const finger = credential.getIn(['detail', 'publicKey'])

    return <ListRow key={credential.get('name')}>
      <ListCol>{credential.get('name')}</ListCol>
      <ListCol>{credential.get('author')}</ListCol>
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
    </ListRow>
  }

  render () {
    const { credentials, i18n } = this.props
    return <List>
      <ListHead>
        <ListRow>
          <ListHeadCol>{i18n('名称')}</ListHeadCol>
          <ListHeadCol>{i18n('创建人')}</ListHeadCol>
          <ListHeadCol>{i18n('创建时间')}</ListHeadCol>
          <ListHeadCol>{i18n('Fingerprint')}</ListHeadCol>
        </ListRow>
      </ListHead>
      <ListBody>
        {credentials.map(this.renderItem)}
      </ListBody>
    </List>
  }
}

export default connect(mapStateToProps)(RSACredentialList)
