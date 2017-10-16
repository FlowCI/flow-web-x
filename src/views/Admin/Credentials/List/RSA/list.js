import React, { Component } from 'react'
import { func } from 'prop-types'
import { list } from 'react-immutable-proptypes'

import { connect } from 'react-redux'

import createI18n from '../../i18n'
import language from 'util/language'
import { Confirm } from 'components/Modal'
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
    alert: func.isRequired,
    i18n: func.isRequired,
  }

  static defaultProps = {
    i18n: createI18n(language).createChild('list.rsa'),
  }

  state = {
    openConfirm: false,
    selected: undefined,
  }

  componentDidMount () {
    this.isMount = true
  }

  componentWillUnmount () {
    this.isMount = false
  }

  openConfirm = (credential) => {
    if (this.isMount) {
      this.setState({ selected: credential, openConfirm: true })
    }
  }

  closeConfirm = () => {
    if (this.isMount) {
      this.setState({ openConfirm: false, selected: undefined })
    }
  }

  handleRemove = () => {
    const { selected } = this.state
    const name = selected.get('name')
    const { remove, alert } = this.props
    return remove(CredentialType, name)
      .then(this.closeConfirm, this.closeConfirm)
      .then(() => {
        alert('success', '删除成功')
      })
  }

  renderItem = (credential) => {
    const { i18n } = this.props
    return <Item key={credential.get('name')}
      i18n={i18n} credential={credential}
      remove={this.openConfirm}
    />
  }

  render () {
    const { credentials, i18n } = this.props
    const { openConfirm, selected } = this.state
    const confirmTitle = selected ? `确认删除证书 ${selected.get('name')} ?`
    : 'Confirm'
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
      <tfoot className='hide'>
        <tr>
          <td>
            <Confirm isOpen={openConfirm} title={confirmTitle}
              onCancel={this.closeConfirm}
              onOk={this.handleRemove}
            />
          </td>
        </tr>
      </tfoot>
    </List>
  }
}

export default connect(mapStateToProps)(RSACredentialList)
