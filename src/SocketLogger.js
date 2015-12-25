import TyphonEvents     from 'typhonjs-core-backbone-events/src/TyphonEvents.js';

import Socket           from 'typhonjs-core-socket/src/Socket.js';
import Queue            from 'typhonjs-core-socket/src/Queue.js';

import setSocketOptions from 'pathSocketPlatformSrc/setSocketOptions.js';

'use strict';

const s_STR_EVENT_CONNECTED = 'socketlogger:connected';
const s_STR_EVENT_DISCONNECTED = 'socketlogger:disconnected';

/**
 * SocketLogger.js -- Provides logging functionality with all log messages posting to the socket specified by the
 * given `host`.
 *
 * The host should formatted as `domain:port`.
 *
 * Log messages are queued until a connection is made. The protocol `socketlogger` is extremely simple.
 *
 * Client:
 * send `msg: connect` -> receives a `msg: connected` message from the server.
 * receive `msg: ping` -> sends a keep alive `msg pong` to the server.
 * send `msg: log, type: <log level>, data: <data>` to send log messages to server.
 *
 * Automatic reconnection is attempted when the connection is lost.
 */
export default class SocketLogger extends TyphonEvents
{
   /**
    * Returns the socket options used by SocketLogger.
    *
    * @returns {Object}
    */
   get socketOptions()  { return this._params.socketOptions; }

   /**
    * Creates SocketLogger with the following socket options passed in by an object hash of parameters:
    *
    * @param {object}   params - Defines an object hash of required and optional parameters including the following:
    * (string)   host - host name / port.
    * (boolean)  ssl - (optional) Indicates if an SSL connection is requested; default (false).
    * (object)   serializer - (optional) An instance of an object which conforms to JSON for serialization; default (JSON).
    * (boolean)  autoConnect - (optional) Indicates if socket should connect on construction; default (true).
    * (boolean)  autoReconnect - (optional) Indicates if socket should reconnect on socket closed; default (true).
    */
   constructor(params = {})
   {
      super();

      /**
       * Defines the current connection status.
       * @type {string}
       */
      this.status = 'disconnected';

      /**
       * Defines the queue to buffer messages.
       * @type {Object}
       */
      this.messageQueue = new Queue((message) =>
      {
         if (this.status === 'connected') { this.socket.send(message); return true; }
         else { return false; }
      });

      // Set WebSocket 'protocol'
      params.protocol = 'socketlogger';

      this._params =
      {
         socketOptions: setSocketOptions(params)
      };

      /**
       * Defines the socket.
       * @type {Object}
       */
      this.socket = new Socket(this.socketOptions);

      this._init();
   }

   /**
    * Connects the socket connection.
    *
    * Note: A connection is automatically attempted on construction of SocketLogger.
    */
   connect()
   {
      this.socket.connect();
   }

   /**
    * Post debug message.
    */
   debug()
   {
      this.messageQueue.push({ msg: 'log', type: 'debug', data: arguments });
   }

   /**
    * Disconnects the socket connection.
    */
   disconnect()
   {
      this.socket.disconnect(...arguments);

      this.status = 'disconnected';

      this.messageQueue.empty();
      super.triggerDefer(s_STR_EVENT_DISCONNECTED, this.socketOptions);
   }

   /**
    * Post error message.
    */
   error()
   {
      this.messageQueue.push({ msg: 'log', type: 'error', data: arguments });
   }

   /**
    * Post fatal message.
    */
   fatal()
   {
      this.messageQueue.push({ msg: 'log', type: 'fatal', data: arguments });
   }

   /**
    * Post info message.
    */
   info()
   {
      this.messageQueue.push({ msg: 'log', type: 'info', data: arguments });
   }

   /**
    * Initializes all Socket callbacks.
    *
    * @private
    */
   _init()
   {
      // When the socket opens, send the `connect` message to establish the DDP connection.
      this.socket.on('socket:open', () =>
      {
         this.socket.send({ msg: 'connect' });
      });

      this.socket.on('socket:close', () =>
      {
         this.status = 'disconnected';

         this.messageQueue.empty();
         super.triggerDefer(s_STR_EVENT_DISCONNECTED, this.socketOptions);
      });

      this.socket.on('socket:message:in', (message) =>
      {
         switch (message.msg)
         {
            case 'connected':
               this.status = 'connected';
               this.messageQueue.process();
               super.triggerDefer(s_STR_EVENT_CONNECTED, this.socketOptions);
               break;

            // Reply with a `pong` message to prevent the server from closing the connection.
            case 'ping':
               this.socket.send({ msg: 'pong', id: message.id });
               break;
         }
      });
   }

   /**
    * Post trace message.
    */
   trace()
   {
      this.messageQueue.push({ msg: 'log', type: 'trace', data: arguments });
   }

   /**
    * Post warn message.
    */
   warn()
   {
      this.messageQueue.push({ msg: 'log', type: 'warn', data: arguments });
   }
}