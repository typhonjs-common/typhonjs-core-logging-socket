'use strict';

import SocketLogger from 'src/SocketLogger.js';

const logger = new SocketLogger('localhost:8001');

logger.debug('Test debug - 1');
logger.error('Test error - 2');
logger.fatal('Test fatal - 3');
logger.info('Test info - 4');
logger.trace('Test trace - 5');
logger.warn('Test warn - 6');
