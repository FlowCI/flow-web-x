import React from 'react'
import PropTypes from 'prop-types'

import createI18n from './i18n'

import Navbar from './Navbar'
import Footer from './Footer'

import classes from './PageLayout.scss'

export const PageLayout = ({ children, i18n, location: { key } }) => (
  <div>
    <Navbar i18n={i18n.createChild('navbar')} locatonKey={key} />
    <div className={classes.container}>
      {children}
    </div>
    <Footer i18n={i18n.createChild('footer')} />
  </div>
)

PageLayout.propTypes = {
  children: PropTypes.node,
  i18n: PropTypes.func.isRequired,
  location: PropTypes.shape({
    key: PropTypes.string
  }).isRequired,
}

PageLayout.defaultProps = {
  i18n: createI18n(LANGUAGES),
}

export default PageLayout
