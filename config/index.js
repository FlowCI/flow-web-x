const path = require('path')
// const argv = require('yargs').argv

const languages = ['zh-cn']

const config = {
  env: process.env.NODE_ENV || 'development',
  target: process.env.TARGET || 'local',

  // Project Structure
  // ----------------------------------
  path_base: path.resolve(__dirname, '..'),
  dir_src: 'src',
  dir_dist: 'dist',
  dir_server: 'server',
  dir_public: 'src/static',
  languages,

  // Server Configuration
  // ----------------------------------
  serverHost: undefined, // default is 0.0.0.0
  serverPort: process.env.PORT || 3000,

  // Compiler Configuration
  // ----------------------------------
  publicPath: '/',
  vendors: [
    'react',
    'react-dom',
    'react-redux',
    'react-router',
    'react-router-redux',
    'redux',
    'redux-thunk',
    'redux-actions',
    'history',
    'immutable',
    'prop-types',
    'reselect',
  ],
  // Environment
  // ------------------------------------
  // N.B.: globals added here must _also_ be added to .eslintrc
  globals: {
    __API__: `"${process.env.FLOW_WEB_API || ''}"`,
    LANGUAGES: `"${languages.join(',')}"`,
  },

  /** Whether to enable verbose logging */
  verbose: false,
}
// Version
// ------------------------------------
const pkg = require('../package.json')
config.version = pkg.version
config.globals.VERSION = `"${config.version}"`
// Utilities
// ------------------------------------
config.pathUtils = (() => {
  const resolve = path.resolve

  const base = (...args) =>
    resolve.apply(resolve, [config.path_base, ...args])

  return {
    base: base,
    src: base.bind(null, config.dir_src),
    dist: base.bind(null, config.dir_dist),
    public: base.bind(null, config.dir_public),
  }
})()

module.exports = config
