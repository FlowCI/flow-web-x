import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Input from 'components/Form/Input'
import Button from 'components/Button'

export default class FlowShedule extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    edit: PropTypes.bool,
    removeabled: PropTypes.bool,
  }

  static defaultProps = {
    remove: function () {}
  }

  render () {
    const { text, edit, removeabled } = this.props
    return <li>
      <Input value={text} readOnly />
      {!edit && removeabled && <Button className='btn-danger'>删除</Button>}
      {edit && <Button className='btn-primary'>保存</Button>}
    </li>
  }
}
