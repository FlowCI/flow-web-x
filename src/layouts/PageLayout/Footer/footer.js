import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import classes from './footer.scss'

export default class Footer extends PureComponent {
  static propTypes = {
    i18n: PropTypes.func.isRequired,
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.i18n !== this.props.i18n
  }

  render () {
    const { i18n } = this.props
    return <footer className={classes.absBottom}>
      <div className={classes.container}>
        <hr />
        <div className={classes.content}>
          <ul className={classes.navs}>
            <li>{i18n('thankFor')}</li>
            <li>
              <a className={classes.navItem}
                href='https://club.flow.ci'
                target='_blank' rel='noopener'>{i18n('club')}</a>
            </li>
            <li>
              <a className={classes.navItem}
                href='https://docs.flow.ci'
                target='_blank' rel='noopener'>{i18n('docs')}</a>
            </li>
          </ul>
          <div>
            Version 1.0 beta
          </div>
        </div>
      </div>
    </footer>
  }
}
