import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { replace } from 'react-router-redux'

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    redirect: replace
  }, dispatch)
})

class NextView extends PureComponent {
  static propTypes = {
    redirect: PropTypes.func.isRequired
  }

  goNext = () => {
    const { redirect } = this.props
    redirect('/')
  }

  render () {
    return <div>
      this is next view, you can
      <button onClick={this.goNext}>go home</button>
    </div>
  }
}

export default connect(undefined, mapDispatchToProps)(NextView)
