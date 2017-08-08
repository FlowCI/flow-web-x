import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

export default class RadioGroups extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    value: PropTypes.any,
    onChange: PropTypes.func,
    className: PropTypes.string,
  }

  handleChange = (e) => {
    const { target: { value: v } } = e
    const { value, onChange } = this.props
    if (value !== v) {
      onChange && onChange(e)
    }
  }

  cloneChild = (child) => {
    return React.cloneElement(child, {
      onChange: this.handleChange,
      checked: child.props.value === this.props.value,
    })
  }

  render () {
    const { className, children } = this.props
    return <div className={className}>
      {React.Children.map(children, this.cloneChild)}
    </div>
  }
}