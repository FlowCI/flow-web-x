import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import keycode from 'keycode'

import Arrow from 'components/Arrow'
import Input from '../Input'
import DropDown from './dropdown'

import classes from './select.scss'

export { classes }

export default class Select extends PureComponent {
  static propTypes = {
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,

    /* if true can input value to search and not show rightIcon */
    showSearch: PropTypes.bool,

    leftIcon: PropTypes.node,

    /*
      show in dropdown menu empty,
      it also can use show loading when fetching data.
      exp: notFoundContent={fetching ? <Loading /> : <NotFound />}
    */
    notFoundContent: PropTypes.node,

    children: PropTypes.node,

    size: PropTypes.oneOf(['sm', 'lg']),
    /*
      classNames can include: .container, .select, .placeholder, .sm, .lg
        .error, .active, .disabled, .loading,
    */
    classNames: PropTypes.object.isRequired,
    className: PropTypes.string,

    /*
      if not match any option use value.toString() to show
        when value is not undefined
      if match it will show option.title
    */
    value: PropTypes.any,

    /*
      true to show or not
      when is func it while call with (inputValue, value: Option.value)
    */
    filterOption: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    /*
      trigger by input value
      type: function (value) {}
    */
    onSearch: PropTypes.func,
    /*
      type: function (value: Option.value) {}
    */
    onChange: PropTypes.func,

    /*
      type； function (event) {}
    */
    onClick: PropTypes.func,
  }

  static defaultProps = {
    classNames: classes,
    className: '',
  }

  state = {
    editValue: '',
    opened: true,
  }

  componentWillMount () {

  }

  componentWillReceiveProps (nextProps) {

  }

  getSelected (value, options) {
    if (value === undefined || value === null) {
      return
    }
    return options.find((opt) => opt.props.value === value)
  }

  getShowValue (value, selected) {
    return selected ? (selected.props.title || selected.props.children) : value
  }

  // handleBlur = (e) => {
  //   this.setState({ opened: false })
  //   const { onBlur } = this.props
  //   onBlur && onBlur(e)
  // }

  handleClick = (e) => {
    const { onClick } = this.props
    onClick && onClick(e)
    this.setState({ opened: !this.state.opened })
  }

  close = (e) => {
    this.setState({ opened: false })
  }

  /*
    todo: 支持键盘事件
  */
  handleKeyDown = (e) => {
    switch (keycode(e)) {
      case 'up':
      case 'down':
      case 'space':
      case 'enter':
        e.preventDefault()
        break
    }
  }

  handleSearchChange = () => {

  }

  handleSelect = (v) => {
    const { onChange } = this.props
    onChange && onChange(v)
    this.close()
    console.log('select', v)
  }

  renderInputFeild (v, opened) {
    const {
      classNames, placeholder,
      leftIcon, size,
      showSearch, disabled
    } = this.props
    const rightIcon = <Arrow up={opened} />

    return <Input
      value={v} size={size}
      rightIcon={rightIcon}
      leftIcon={leftIcon}
      className={classNames.input}
      readOnly={!showSearch || disabled}
      placeholder={placeholder}
      onChange={this.handleSearchChange}
      onClick={this.handleClick}
    />
    // onKeyDown={this.handleKeyDown}
  }

  cloneOption (selected, option, index) {
    return React.cloneElement(option, {
      selected: selected === option,
      onSelect: this.handleSelect
    })
  }

  renderDropdown (selected, options) {
    const { classNames } = this.props
    const iterator = this.cloneOption.bind(this, selected)
    return <DropDown className={classNames.dropdown}
      onRequestClose={this.close}
    >
      <ul className={classNames.options}>
        {options.map(iterator)}
      </ul>
    </DropDown>
  }

  render () {
    const {
      classNames, className,
      children, value,
      disabled, size,
    } = this.props

    const { opened } = this.state

    const options = React.Children.toArray(children)
    const selected = this.getSelected(value, options)
    const v = this.getShowValue(value, selected) || ''

    const cls = [classNames.select, className]

    size && cls.push(classNames[size])
    opened && cls.push(classNames.active)
    disabled && cls.push(classNames.disabled)

    return <div className={cls.join(' ')}>
      {this.renderInputFeild(v, opened)}
      {opened && this.renderDropdown(selected, options)}
    </div>
  }
}
