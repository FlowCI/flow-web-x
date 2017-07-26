const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const config = require('../config')

const __DEV__ = config.env === 'development'
const __TEST__ = config.env === 'test'
const __PROD__ = config.env === 'production'

const paths = config.pathUtils

const LOCALES = config.languages.map((lang) => {
  return lang.replace(/[\-]/g, '\\$&')
}).join('|')


const webpackConfig = {
  entry: {
    main: [paths.src('main.js')],
  },
  // devtool: __DEV__ ? 'source-map' : false,
  output: {
    path: paths.dist(),
    filename: '[name].[hash].js',
    publicPath: config.publicPath,
  },
  resolve: {
    modules: [
      paths.src(),
      paths.base('packages'),
      'node_modules',
    ],
    extensions: ['*', '.js', '.jsx', '.json'],
  },
  module: {
    rules: [],
  },
  plugins: [
    new webpack.DefinePlugin(Object.assign({}, {
      'process.env': { NODE_ENV: JSON.stringify(config.env) },
      __DEV__,
      __TEST__,
      __PROD__,
    }, config.globals)),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/,
      new RegExp(LOCALES)),
    new webpack.ContextReplacementPlugin(/src[\/\\]views\S*[\/\\]locale$/,
      new RegExp(LOCALES)),
  ],
}

// Json
// ------------------------------------
webpackConfig.module.rules.push({
  test: /\.json$/,
  use: [{
    loader: 'json-loader'
  }]
})

// JavaScript
// ------------------------------------

// eslint
webpackConfig.module.rules.push({
  test: /\.js$/,
  exclude: [
    /node_modules/,
    /static/,
  ],
  enforce: "pre",
  use: [{
    loader: 'eslint-loader'
  }]
})

// babel
webpackConfig.module.rules.push({
  test: /\.js$/,
  exclude: [
    /node_modules/,
    /static/,
  ],
  use: [{
    loader: 'babel-loader',
    query: {
      cacheDirectory: true,
    },
  }],
})

// test
webpackConfig.module.rules.push({
  test: /\.spec\.js$/,
  use: [{
    loader: 'babel-loader',
    query: {
      cacheDirectory: true,
    },
  }],
})
// Styles
// ------------------------------------
const extractStyles = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',
  allChunks: true,
  disable: __DEV__,
})

webpackConfig.module.rules.push({
  test: /\.(sass|scss)$/,
  loader: extractStyles.extract({
    fallback: 'style-loader',
    use: [
      {
        loader: 'css-loader',
        options: {
          sourceMap: __DEV__,
          modules: true, // use css module
          localIdentName: __DEV__ ? '[name]_[local]_[hash:base64:5]'
            : '[hash:base64:5]',
          minimize: {
            autoprefixer: {
              add: true,
              remove: true,
              browsers: ['last 2 versions'],
            },
            discardComments: {
              removeAll : true,
            },
            discardUnused: false,
            mergeIdents: false,
            reduceIdents: false,
            safe: true,
            sourcemap: __DEV__,
          },
        },
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: __DEV__,
          includePaths: [
            paths.src('styles'),
          ],
        },
      }
    ],
  })
})
webpackConfig.plugins.push(extractStyles)

// Images
// ------------------------------------
webpackConfig.module.rules.push({
  test    : /\.(png|jpg|gif)$/,
  loader  : 'url-loader',
  options : {
    limit : 8192,
  },
})

// Fonts
// ------------------------------------
;[
  ['woff', 'application/font-woff'],
  ['woff2', 'application/font-woff2'],
  ['otf', 'font/opentype'],
  ['ttf', 'application/octet-stream'],
  ['eot', 'application/vnd.ms-fontobject'],
  ['svg', 'image/svg+xml'],
].forEach((font) => {
  const extension = font[0]
  const mimetype = font[1]

  webpackConfig.module.rules.push({
    test    : new RegExp(`\\.${extension}$`),
    loader  : 'url-loader',
    options : {
      name  : 'fonts/[name][hash].[ext]',
      limit : 10000,
      mimetype,
    },
  })
})

// HTML Template
// ------------------------------------
webpackConfig.plugins.push(new HtmlWebpackPlugin({
  template: paths.src('index.html'),
  chunksSortMode: 'dependency',
  favicon: paths.public('favicon.ico'),
  inject: true,
  minify: {
    collapseWhitespace: true,
  },
  version: config.version,
  last_modify: new Date().toISOString(),
}))

// Development Tools
// ------------------------------------
if (__DEV__) {
  webpackConfig.entry.main.push(
    `webpack-hot-middleware/client.js?path=${config.publicPath}__webpack_hmr`
  )
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  )
}

// Bundle Splitting
// ------------------------------------
if (!__TEST__) {
  const bundles = ['manifest']

  if (config.vendors && config.vendors.length) {
    bundles.unshift('vendor')
    webpackConfig.entry.vendor = config.vendors
  }
  webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin({ names: bundles }))
}

// Production Optimizations
// ------------------------------------
if (__PROD__) {
  webpackConfig.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      comments: false,
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
    })
  )
}

module.exports = webpackConfig
