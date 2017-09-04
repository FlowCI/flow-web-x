import React, { Component } from 'react'
import { func } from 'prop-types'

import createI18n from './i18n'
import language from 'util/language'

import { connect } from 'react-redux'

import Title from '../components/Title'

function mapStateToProps (state, props) {
  return {
  }
}

export class AdminNotifyEmail extends Component {
  static propTypes = {
    i18n: func.isRequired,
  }

  static defaultProps = {
    i18n: createI18n(language),
  }

  render () {
    const { i18n } = this.props
    return <div>
      <Title title={i18n('title')} subTitle={i18n('subTitle')} />
    </div>
  }
}

export default connect(mapStateToProps)(AdminNotifyEmail)
