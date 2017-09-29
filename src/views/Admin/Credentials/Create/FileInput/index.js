import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { createReduxFormField } from 'components/Form/reduxForm'
import FileUploader from 'components/FileUploader'

import classes from './input.scss'

export class FileInput extends Component {
  static propTypes = {
    className: PropTypes.string,
    input: PropTypes.object.isRequired,
    meta: PropTypes.object,
  }

  getFileName (value) {
    return value ? value.name : ''
  }
  render () {
    const {
      className,
      input,
      meta, // eslint-disable-line no-unused-vars
      ...other,
    } = this.props
    const { value } = input
    const fileName = this.getFileName(value)

    const cls = [classes.input]
    className && cls.push(className)
    return <FileUploader {...other} {...input} className={cls.join(' ')}>
      {fileName || '选择文件'}
    </FileUploader>
  }
}

export default createReduxFormField(FileInput)
