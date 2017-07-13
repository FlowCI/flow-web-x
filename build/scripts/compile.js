const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const logger = require('../lib/logger')
const webpackConfig = require('../webpack.config')
const projectConfig = require('../../config')

const runWebpackCompiler = (webpackConfig) =>
  new Promise((resolve, reject) => {
    webpack(webpackConfig).run((err, stats) => {
      if (err) {
        logger.error('Webpack compiler encountered a fatal error.', err)
        return reject(err)
      }

      const jsonStats = stats.toJson()
      if (jsonStats.errors.length > 0) {
        logger.error('Webpack compiler encountered errors.')
        logger.log(jsonStats.errors.join('\n'))
        return reject(new Error('Webpack compiler encountered errors'))
      } else if (jsonStats.warnings.length > 0) {
        logger.warn('Webpack compiler encountered warnings.')
        logger.log(jsonStats.warnings.join('\n'))
      }
      resolve(stats)
    })
  })

const compile = () => Promise.resolve()
  .then(() => logger.info('Starting compiler...'))
  .then(() => logger.info('Target application environment: ' + chalk.bold(projectConfig.env)))
  .then(() => runWebpackCompiler(webpackConfig))
  .then((stats) => {
    logger.info(`Copying static assets from ./${projectConfig.dir_public} to ./${projectConfig.dir_dist}.`)
    fs.copySync(
      projectConfig.pathUtils.public(),
      projectConfig.pathUtils.dist()
    )
    return stats
  })
  .then((stats) => {
    if (projectConfig.verbose) {
      logger.log(stats.toString({
        colors: true,
        chunks: false,
      }))
    }
    logger.success(`Compiler finished successfully! See ./${projectConfig.dir_dist}.`)
  })
  .catch((err) => logger.error('Compiler encountered errors.', err))

compile()
