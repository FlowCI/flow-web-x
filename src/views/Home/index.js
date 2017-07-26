import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import createI18n from './i18n'
const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    redirect: push
  }, dispatch)
})

class HomeView extends PureComponent {
  static propTypes = {
    redirect: PropTypes.func.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  static defaultProps = {
    i18n: createI18n('zh-cn')
  }

  goNext = () => {
    const { redirect } = this.props
    redirect('/next')
  }

  render () {
    const { i18n } = this.props
    return <div>
      {i18n('text')}
      <button onClick={this.goNext}>to next view</button>
    </div>
  }
}

export default connect(undefined, mapDispatchToProps)(HomeView)
