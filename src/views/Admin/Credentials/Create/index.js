import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'redux/modules/credential'

import form from './form'

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    create: actions.create,
  }, dispatch)
}

export default connect(undefined, mapDispatchToProps)(form)
