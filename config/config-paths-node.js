/**
 * Loads mapped paths for platform code in the browser and via Gulp / Node.js allowing normalized dependencies to be
 * used in defining further mapped paths.
 *
 * NOTE: PRESENTLY THIS IS UNUSED / INCOMPLETE; websocket for Node requires node gyp / C compiled resources which
 * doesn't play nice with installing via JSPM.
 *
 * 'node_modules/websocket/lib/Validation.js'
 * 'node_modules/websocket/lib/BufferUtils.js'
 *
 * Attempt to load native resources, but the SystemJS `require` appends `*.js` instead of `*.node`.
 *
 * To test though remove the try/catch blocks in Validation & BufferUtils and load the fallback versions.
 */
/* eslint-disable */

var System = System || global.System;

var pathPlatformSrc = 'src/platforms/node';

System.config(
{
   map:
   {
      // Maps require to node_modules for websocket
      'websocket': 'node_modules/websocket/lib/W3CWebSocket',
      'typedarray-to-buffer': 'node_modules/typedarray-to-buffer/index',
      'is-typedarray': 'node_modules/is-typedarray/index',
      'yaeti': 'node_modules/yaeti/index',
      'debug': 'node_modules/debug/debug',
      'ms': 'node_modules/ms/index',

      // Maps built in Node modules
      'buffer': '@node/buffer',
      'crypto': '@node/crypto',
      'events': '@node/events',
      'http': '@node/http',
      'https': '@node/https',
      'url': '@node/url',
      'util': '@node/util',

      'pathSocketPlatformSrc': System.map['typhonjs-core-socket'] + '/' + pathPlatformSrc,
      'pathPlatformSrc': pathPlatformSrc
   }
});