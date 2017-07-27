import { Component } from 'react'
import PropTypes from 'prop-types'

import {
  unstable_renderSubtreeIntoContainer as renderIntoContainer,
  unmountComponentAtNode
} from 'react-dom'

const isDescendant = function (parent, child) {
  let node = child.parentNode

  while (node !== null) {
    if (node === parent) return true
    node = node.parentNode
  }

  return false
}

/**
  copy from material-ui RenderToLayer
**/
class RenderToLayer extends Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    className: PropTypes.string,
    render: PropTypes.func.isRequired,
    onClickAway: PropTypes.func
  };

  static defaultProps = {
  };

  componentDidMount () {
    this.renderLayer()
  }

  componentDidUpdate (preProps) {
    this.renderLayer()
  }

  componentWillUnmount () {
    this.unrenderLayer()
  }

  handleClickAway = (event) => {
    if (event.defaultPrevented) {
      return
    }
    const { onClickAway, isOpen } = this.props
    if (!onClickAway || !isOpen) {
      return
    }
    const el = this.layer
    const { target } = event
    if ((target !== el && target === window) ||
      (document.documentElement.contains(target) &&
        !isDescendant(el, target)
    )) {
      onClickAway(event)
    }
  }

  getLayer () {
    return this.layer
  }

  unrenderLayer () {
    if (!this.layer) {
      return
    }

    // this.unbindClickAway()

    unmountComponentAtNode(this.layer)
    document.body.removeChild(this.layer)
    this.layer = null
  }

  bindClickAway () {
    const { onClickAway } = this.props
    if (onClickAway) {
      setTimeout(() => {
        window.addEventListener('touchstart', this.handleClickAway)
        window.addEventListener('click', this.handleClickAway)
      }, 0)
    }
  }

  unbindClickAway () {
    const el = window
    el.removeEventListener('touchstart', this.handleClickAway)
    el.removeEventListener('click', this.handleClickAway)
  }

  renderLayer () {
    const {
      isOpen,
      render
    } = this.props

    if (isOpen) {
      if (!this.layer) {
        this.layer = document.createElement('div')
        document.body.appendChild(this.layer)
        // this.bindClickAway()
      }
      /**
       * We use the <MuiThemeProvider /> component as a work around for
       * https://github.com/facebook/react/issues/6599.
       */
      const layerElement = render()
      this.layerElement = renderIntoContainer(this, layerElement, this.layer)
    } else {
      this.unrenderLayer()
    }
  }

  render () {
    return null
  }
}

export default RenderToLayer
