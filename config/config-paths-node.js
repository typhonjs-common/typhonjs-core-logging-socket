/**
 * Loads mapped paths for platform code in the browser and via Gulp / Node.js allowing normalized dependencies to be
 * used in defining further mapped paths.
 */
/* eslint-disable */

var System = System || global.System;

var pathPlatformSrc = 'src/platforms/node';

System.config(
{
   map:
   {
      'pathSocketPlatformSrc': System.map['typhonjs-core-socket'] + '/' + pathPlatformSrc,
      'pathPlatformSrc': pathPlatformSrc
   }
});