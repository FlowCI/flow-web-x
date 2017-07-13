const logger = require('../lib/logger')
const config = require('../../config')

logger.info('Starting server...')
require('../../server/main').listen(config.serverPort, config.serverHost, () => {
  logger.success('Server is running at http://localhost:3000')
})
