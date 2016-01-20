/**
 * NOTE: PRESENTLY THIS IS UNUSED / INCOMPLETE; websocket for Node requires node gyp / C compiled resources which
 * doesn't play nice with installing via JSPM.
 */

'use strict';

Promise.all(
[
   System.import('config/config-paths-node.js'),
   System.import('src/SocketLogger.js')
]).then((modules) =>
{
   console.log("mainTestHttp (node) - 0");

   modules.shift();

   const SocketLogger = modules.shift();

   console.log("mainTestHttp (node) - 1 - SocketLogger: " +SocketLogger);

   const logger = new SocketLogger({ host: 'localhost:8001' });

   logger.debug('Test debug - 1');
   logger.error('Test error - 2');
   logger.fatal('Test fatal - 3');
   logger.info('Test info - 4');
   logger.trace('Test trace - 5');
   logger.warn('Test warn - 6');
}).catch((error) =>
{
   console.log("mainTestHttp (node) - error: " +error);
});