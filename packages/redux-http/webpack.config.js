const path = require('path')
const webpack = require('webpack')

const env = process.env.NODE_ENV
const __DEV__ = env === 'development'
const __TEST__ = env === 'test'
const __PROD__ = env === 'production'

const webpackConfig = {
  entry: {
    app: './src/index.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash].js',
    library: 'redux-http',
    libraryTarget: "umd"
  },
  resolve: {
    modules: [
      path.join(__dirname, 'src'),
      'node_modules'
    ],
    extensions: ['*', '.js', '.json']
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        query: {
          cacheDirectory: true
        }
      }]
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(process.env.NODE_ENV) },
      __DEV__,
      __TEST__,
      __PROD__
    })
  ]
}
module.exports = webpackConfig