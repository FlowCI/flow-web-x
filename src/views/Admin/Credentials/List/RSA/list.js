import React, { Component } from 'react'
import { func } from 'prop-types'
import { list } from 'react-immutable-proptypes'

import { connect } from 'react-redux'

import createI18n from '../../i18n'
import language from 'util/language'

import {
  List,
  ListHead,
  ListHeadCol,
  ListBody,
  ListRow,
} from '../../../components/List'

import Item from './item'

function mapStateToProps (state, props) {
  const { credential } = state
  return {
    credentials: credential.get('RSA'),
  }
}

const CredentialType = 'RSA'

export class RSACredentialList extends Component {
  static propTypes = {
    credentials: list.isRequired,
    remove: func.isRequired,
    i18n: func.isRequired,
  }

  static defaultProps = {
    i18n: createI18n(language).createChild('list.rsa'),
  }

  handleRemove = (credential) => {
    const name = credential.get('name')
    const { remove } = this.props
    return remove(CredentialType, name)
  }

  renderItem = (credential) => {
    const { i18n } = this.props
    return <Item key={credential.get('name')}
      i18n={i18n} credential={credential}
      remove={this.handleRemove}
    />
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
          <ListHeadCol>&nbsp;</ListHeadCol>
        </ListRow>
      </ListHead>
      <ListBody>
        {credentials.map(this.renderItem)}
      </ListBody>
    </List>
  }
}

export default connect(mapStateToProps)(RSACredentialList)
