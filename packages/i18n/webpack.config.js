const path = require('path')
const webpack = require('webpack')

const webpackConfig = {
  entry: {
    app: './src/index.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[chunkhash].js',
    library: 'i18n',
    libraryTarget: "umd"
  },
  resolve: {
    modules: [
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
  }
}
module.exports = webpackConfig