/**
 * Loads mapped paths for platform code in the browser and via Gulp / Node.js allowing normalized dependencies to be
 * used in defining further mapped paths.
 *
 * NOTE: PRESENTLY THIS IS UNUSED / INCOMPLETE; websocket for Node requires node gyp / C compiled resources which
 * doesn't play nice with installing via JSPM.
 */
/* eslint-disable */

var System = System || global.System;

var pathPlatformSrc = 'src/platforms/node';

System.config(
{
   map:
   {
      'websocket': 'node_modules/websocket/lib/W3CWebSocket.js',
      'pathSocketPlatformSrc': System.map['typhonjs-core-socket'] + '/' + pathPlatformSrc,
      'pathPlatformSrc': pathPlatformSrc
   }
});