/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.ping = (function() {

    /**
     * Namespace ping.
     * @exports ping
     * @namespace
     */
    var ping = {};

    ping.PingService = (function() {

        /**
         * Constructs a new PingService service.
         * @memberof ping
         * @classdesc Represents a PingService
         * @extends $protobuf.rpc.Service
         * @constructor
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         */
        function PingService(rpcImpl, requestDelimited, responseDelimited) {
            $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
        }

        (PingService.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = PingService;

        /**
         * Creates new PingService service using the specified rpc implementation.
         * @function create
         * @memberof ping.PingService
         * @static
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         * @returns {PingService} RPC service. Useful where requests and/or responses are streamed.
         */
        PingService.create = function create(rpcImpl, requestDelimited, responseDelimited) {
            return new this(rpcImpl, requestDelimited, responseDelimited);
        };

        /**
         * Callback as used by {@link ping.PingService#ping}.
         * @memberof ping.PingService
         * @typedef PingCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {ping.Response} [response] Response
         */

        /**
         * Calls Ping.
         * @function ping
         * @memberof ping.PingService
         * @instance
         * @param {ping.IRequest} request Request message or plain object
         * @param {ping.PingService.PingCallback} callback Node-style callback called with the error, if any, and Response
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(PingService.prototype.ping = function ping(request, callback) {
            return this.rpcCall(ping, $root.ping.Request, $root.ping.Response, request, callback);
        }, "name", { value: "Ping" });

        /**
         * Calls Ping.
         * @function ping
         * @memberof ping.PingService
         * @instance
         * @param {ping.IRequest} request Request message or plain object
         * @returns {Promise<ping.Response>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link ping.PingService#pingStream}.
         * @memberof ping.PingService
         * @typedef PingStreamCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {ping.Response} [response] Response
         */

        /**
         * Calls PingStream.
         * @function pingStream
         * @memberof ping.PingService
         * @instance
         * @param {ping.IRequest} request Request message or plain object
         * @param {ping.PingService.PingStreamCallback} callback Node-style callback called with the error, if any, and Response
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(PingService.prototype.pingStream = function pingStream(request, callback) {
            return this.rpcCall(pingStream, $root.ping.Request, $root.ping.Response, request, callback);
        }, "name", { value: "PingStream" });

        /**
         * Calls PingStream.
         * @function pingStream
         * @memberof ping.PingService
         * @instance
         * @param {ping.IRequest} request Request message or plain object
         * @returns {Promise<ping.Response>} Promise
         * @variation 2
         */

        return PingService;
    })();

    ping.Request = (function() {

        /**
         * Properties of a Request.
         * @memberof ping
         * @interface IRequest
         * @property {string|null} [msg] Request msg
         */

        /**
         * Constructs a new Request.
         * @memberof ping
         * @classdesc Represents a Request.
         * @implements IRequest
         * @constructor
         * @param {ping.IRequest=} [properties] Properties to set
         */
        function Request(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Request msg.
         * @member {string} msg
         * @memberof ping.Request
         * @instance
         */
        Request.prototype.msg = "";

        /**
         * Creates a new Request instance using the specified properties.
         * @function create
         * @memberof ping.Request
         * @static
         * @param {ping.IRequest=} [properties] Properties to set
         * @returns {ping.Request} Request instance
         */
        Request.create = function create(properties) {
            return new Request(properties);
        };

        /**
         * Encodes the specified Request message. Does not implicitly {@link ping.Request.verify|verify} messages.
         * @function encode
         * @memberof ping.Request
         * @static
         * @param {ping.IRequest} message Request message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Request.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.msg != null && Object.hasOwnProperty.call(message, "msg"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.msg);
            return writer;
        };

        /**
         * Encodes the specified Request message, length delimited. Does not implicitly {@link ping.Request.verify|verify} messages.
         * @function encodeDelimited
         * @memberof ping.Request
         * @static
         * @param {ping.IRequest} message Request message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Request.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Request message from the specified reader or buffer.
         * @function decode
         * @memberof ping.Request
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {ping.Request} Request
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Request.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ping.Request();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.msg = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Request message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof ping.Request
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {ping.Request} Request
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Request.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Request message.
         * @function verify
         * @memberof ping.Request
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Request.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.msg != null && message.hasOwnProperty("msg"))
                if (!$util.isString(message.msg))
                    return "msg: string expected";
            return null;
        };

        /**
         * Creates a Request message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof ping.Request
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {ping.Request} Request
         */
        Request.fromObject = function fromObject(object) {
            if (object instanceof $root.ping.Request)
                return object;
            var message = new $root.ping.Request();
            if (object.msg != null)
                message.msg = String(object.msg);
            return message;
        };

        /**
         * Creates a plain object from a Request message. Also converts values to other types if specified.
         * @function toObject
         * @memberof ping.Request
         * @static
         * @param {ping.Request} message Request
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Request.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.msg = "";
            if (message.msg != null && message.hasOwnProperty("msg"))
                object.msg = message.msg;
            return object;
        };

        /**
         * Converts this Request to JSON.
         * @function toJSON
         * @memberof ping.Request
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Request.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Request
         * @function getTypeUrl
         * @memberof ping.Request
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Request.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/ping.Request";
        };

        return Request;
    })();

    ping.Response = (function() {

        /**
         * Properties of a Response.
         * @memberof ping
         * @interface IResponse
         * @property {string|null} [msg] Response msg
         */

        /**
         * Constructs a new Response.
         * @memberof ping
         * @classdesc Represents a Response.
         * @implements IResponse
         * @constructor
         * @param {ping.IResponse=} [properties] Properties to set
         */
        function Response(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Response msg.
         * @member {string} msg
         * @memberof ping.Response
         * @instance
         */
        Response.prototype.msg = "";

        /**
         * Creates a new Response instance using the specified properties.
         * @function create
         * @memberof ping.Response
         * @static
         * @param {ping.IResponse=} [properties] Properties to set
         * @returns {ping.Response} Response instance
         */
        Response.create = function create(properties) {
            return new Response(properties);
        };

        /**
         * Encodes the specified Response message. Does not implicitly {@link ping.Response.verify|verify} messages.
         * @function encode
         * @memberof ping.Response
         * @static
         * @param {ping.IResponse} message Response message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Response.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.msg != null && Object.hasOwnProperty.call(message, "msg"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.msg);
            return writer;
        };

        /**
         * Encodes the specified Response message, length delimited. Does not implicitly {@link ping.Response.verify|verify} messages.
         * @function encodeDelimited
         * @memberof ping.Response
         * @static
         * @param {ping.IResponse} message Response message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Response.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Response message from the specified reader or buffer.
         * @function decode
         * @memberof ping.Response
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {ping.Response} Response
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Response.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ping.Response();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.msg = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Response message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof ping.Response
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {ping.Response} Response
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Response.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Response message.
         * @function verify
         * @memberof ping.Response
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Response.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.msg != null && message.hasOwnProperty("msg"))
                if (!$util.isString(message.msg))
                    return "msg: string expected";
            return null;
        };

        /**
         * Creates a Response message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof ping.Response
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {ping.Response} Response
         */
        Response.fromObject = function fromObject(object) {
            if (object instanceof $root.ping.Response)
                return object;
            var message = new $root.ping.Response();
            if (object.msg != null)
                message.msg = String(object.msg);
            return message;
        };

        /**
         * Creates a plain object from a Response message. Also converts values to other types if specified.
         * @function toObject
         * @memberof ping.Response
         * @static
         * @param {ping.Response} message Response
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Response.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.msg = "";
            if (message.msg != null && message.hasOwnProperty("msg"))
                object.msg = message.msg;
            return object;
        };

        /**
         * Converts this Response to JSON.
         * @function toJSON
         * @memberof ping.Response
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Response.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Response
         * @function getTypeUrl
         * @memberof ping.Response
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Response.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/ping.Response";
        };

        return Response;
    })();

    return ping;
})();

module.exports = $root;
