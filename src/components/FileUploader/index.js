import React, { Component } from 'react'
import PropTypes from 'prop-types'

// todo safari 不支持 accept
export default class FileUploader extends Component {
  static propTypes = {
    className: PropTypes.string,
    classNames: PropTypes.object.isRequired,

    multiple: PropTypes.bool,
    accept: PropTypes.string,
    meta: PropTypes.any,

    children: PropTypes.node,

    disabled: PropTypes.bool,
    onChange: PropTypes.func
  };

  static defaultProps = {
    value: '',
    classNames: {},
  }

  getFiles (e) {
    let files = []
    if (e.dataTransfer) {
      files = e.dataTransfer.files
    } else if (e.target) {
      files = e.target.files
    }
    const array = [...files]
    array.x = new Date() // 防止 redux-form 缓存组件，不进行渲染
    return array
  }

  handleChange = (e) => {
    const { onChange } = this.props
    onChange && onChange(this.getFiles(e))
  }

  handleClick = (e) => {
    const { disabled } = this.props
    if (!disabled) {
      const { fileSelect } = this
      fileSelect && fileSelect.click()
    }
  }

  render () {
    const {
      classNames,
      className,
      children,
      onChange, // eslint-disable-line no-unused-vars
      meta, // eslint-disable-line no-unused-vars
      ...other
    } = this.props

    const cls = []
    classNames.fileInput && cls.push(classNames.fileInput)
    className && cls.push(className)

    return <div className={cls.join(' ')}>
      <input {...other}
        ref={(el) => { this.fileSelect = el }}
        style={{ display: 'none' }} type='file'
        value='' onChange={this.handleChange}
      />
      <div className={classNames.wrapper} onClick={this.handleClick}>
        {children}
      </div>
    </div>
  }
}
