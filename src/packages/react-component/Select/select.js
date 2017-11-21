import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Input from '../Input'

import classnames from 'classnames'
import classes from 'rc-theme/select.scss'

/**
 * @example ./select.example.md
 */
export default class Select extends Component {
  static propTypes = {
    size: PropTypes.oneOf(['xs', 'sm', 'lg']),
    className: PropTypes.string,
    classNames: PropTypes.object.isRequired,
    inputClassNames: PropTypes.object,

    placeholder: PropTypes.string,

    value: PropTypes.any,

    leftIcon: PropTypes.node,

    disabled: PropTypes.bool,

    /**
     * Option nodes
     */
    children: PropTypes.node,
    /**
     * 是否未过校验，同 Input.props.invalid
     */
    invalid: PropTypes.bool,

    /**
     * loading 时将会把 spinner 显示在下拉菜单中
     */
    loading: PropTypes.bool,
    spinner: PropTypes.node,

    /**
     * function (value) { }
     */
    onChange: PropTypes.func
  }

  static defaultProps = {
    classNames: classes,
    spinner: <i className='icon icon-loading' />
  }

  state = {
    opened: false,
  }

  getSelected () {
    const { children, value } = this.props
    const childs = React.Children.toArray(children)
    return childs.find((child) => child.props.value === value)
  }

  getArrow () {
    const { opened } = this.state
    const { classNames } = this.props
    return <i className={classnames('icon icon-caretdown', classNames.arrow, {
      'up': opened
    })} />
  }

  handleInputClick = (e) => {
    const { disabled } = this.props
    if (disabled) {
      return
    }
    this.setState({ opened: !this.state.opened })
  }

  handleBlur = () => {
    if (this.state.opened) {
      // 由于现在是直接删 dom，太快可能不会触发 li 的 click 事件，所以添加延迟
      setTimeout(() => this.setState({ opened: false }), 100)
    }
  }

  /**
   * 目前只支持单选，所以 selected 参数无效，仅作为保留参数
   * @param Option.props.value
   * @param !Option.props.selected
   */
  handleSelected = (value, selected) => {
    const { onChange, value: v } = this.props
    if (value !== v) {
      onChange && onChange(value)
    }
  }

  cloneOption = (selected, option, index) => {
    return React.cloneElement(option, {
      selected: selected && option
        ? selected.props.value === option.props.value : false,
      onSelect: this.handleSelected
    })
  }

  renderDropDown (selected) {
    const { size, classNames, children, loading, spinner } = this.props
    const childs = React.Children.toArray(children)
    const clone = this.cloneOption.bind(this, selected)
    return <div className={classnames(classNames.dropdown, classNames[size])}>
      <ul className={classNames.options}>
        {!loading && childs.map(clone)}
        {loading && <li className={classNames.loading}>
          {spinner}
        </li>}
      </ul>
    </div>
  }

  renderInputField (selected, arrow) {
    const {
      placeholder, invalid, disabled,
      inputClassNames, classNames,
      leftIcon, size,
    } = this.props
    return <Input readOnly disabled={disabled}
      value={selected ? (selected.props.label || selected.props.children) : ''}
      placeholder={placeholder} invalid={invalid}
      classNames={inputClassNames}
      className={classNames['input-wrapper']}
      inputClassName={classNames.input}
      size={size} leftIcon={leftIcon}
      rightIcon={this.getArrow()}
      onClick={this.handleInputClick}
    />
  }

  render () {
    const { classNames, className, disabled } = this.props
    const { opened } = this.state
    const selected = this.getSelected()
    return <div className={classnames(classNames.select, className, {
      'disabled': disabled,
    })} onBlur={this.handleBlur}>
      {this.renderInputField(selected)}
      {opened && this.renderDropDown(selected)}
    </div>
  }
}
