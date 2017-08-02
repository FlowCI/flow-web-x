import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { Footer, Container } from 'components/Layout'

import classes from './footer.scss'

export default class PageLayoutFooter extends PureComponent {
  static propTypes = {
    i18n: PropTypes.func.isRequired,
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.i18n !== this.props.i18n
  }

  render () {
    const { i18n } = this.props
    return <Footer>
      <Container>
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
      </Container>
    </Footer>
  }
}
