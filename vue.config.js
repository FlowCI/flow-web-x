const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js'
      }
    },

    plugins: [
      new MonacoWebpackPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          APP_VERSION: JSON.stringify(require('./package.json').version),
        }
      })
    ]
  }
}
