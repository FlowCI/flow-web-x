import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import keycode from 'keycode'

import Arrow from 'components/Arrow'
import Loading from 'components/Loading'

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
    searchabled: PropTypes.bool,

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
      see more in './select.scss'
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
      trigger by input value
      type: function (value) {}
    */
    onFilterChange: PropTypes.func,
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
    title: '',
    opened: true,
  }

  componentWillMount () {
    this.state.title = this.getTitle()
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({
        title: this.getTitle(nextProps)
      })
    }
  }

  getTitle (props = this.props) {
    const { value, children } = props
    const options = React.Children.toArray(children)
    const selected = this.getSelected(value, options)
    return selected ? (selected.props.title || selected.props.children) : value
  }

  getSelected (value, options) {
    if (value === undefined || value === null) {
      return
    }
    return options.find((opt) => opt.props.value === value)
  }

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

  handleSearchChange = (e) => {
    const { onFilterChange } = this.props
    const value = e.target.value
    this.setState({ title: value })
    onFilterChange && onFilterChange(value)
  }

  handleSelect = (v) => {
    const { onChange } = this.props
    onChange && onChange(v)
    this.close()
  }

  renderInputFeild (v, opened) {
    const {
      classNames, placeholder,
      leftIcon, size,
      searchabled, disabled
    } = this.props
    const rightIcon = searchabled ? undefined : <Arrow up={opened} />

    return <Input
      value={v || ''} size={size}
      rightIcon={rightIcon}
      leftIcon={leftIcon}
      className={classNames.input}
      readOnly={!searchabled || disabled}
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

  renderOptions (selected, options) {
    const { classNames } = this.props
    const iterator = this.cloneOption.bind(this, selected)
    return <ul className={classNames.options}>
      {options.map(iterator)}
    </ul>
  }

  renderNotFound () {
    const { notFoundContent, classNames } = this.props
    if (notFoundContent) {
      return <div className={classNames.notFound}>
        {notFoundContent}
      </div>
    }
  }

  renderLoading () {
    const { classNames } = this.props
    return <div className={classNames.loading}>
      <Loading size={20} />
    </div>
  }

  renderDropdown (selected, options) {
    const { classNames, loading } = this.props
    const content = loading ? this.renderLoading()
      : (options.length ? this.renderOptions(selected, options)
        : this.renderNotFound())
    if (content) {
      return <DropDown className={classNames.dropdown}
        onRequestClose={this.close}
      >
        {content}
      </DropDown>
    }
  }

  render () {
    const {
      classNames, className,
      children, value,
      disabled, size,
    } = this.props

    const { title, opened } = this.state

    const options = React.Children.toArray(children)
    const selected = this.getSelected(value, options)

    const cls = [classNames.select, className]

    size && cls.push(classNames[size])
    opened && cls.push(classNames.active)
    disabled && cls.push(classNames.disabled)

    return <div className={cls.join(' ')}>
      {this.renderInputFeild(title, opened)}
      {opened && this.renderDropdown(selected, options)}
    </div>
  }
}
