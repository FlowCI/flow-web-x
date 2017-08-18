import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import Select, { Option, classes } from '../Select'

export { classes }
export default class AutoComplete extends PureComponent {
  static propTypes = {
    /*
      value must be an string
    */
    value: PropTypes.string,

    dataSource: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string.isRequired,
      title: PropTypes.string,
    })),
    onFilterChange: PropTypes.func,
  }

  getOptions (dataSource) {
    const { value } = this.props
    const f = value.replace('\\', '\\\\')
    return dataSource.filter((data) => RegExp(f, 'gi').test(data.title))
  }

  renderDataSource (options) {
    return options.map((option) => <Option value={option.value}
      title={option.title || option.value}
      key={option.value} />
    )
  }

  render () {
    const { dataSource, ...other } = this.props
    const options = this.getOptions(dataSource)

    return <Select {...other} searchabled>
      {this.renderDataSource(options)}
    </Select>
  }
}
