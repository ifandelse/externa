/*!
 * externa - A library to manage communicating between windows, iframes and web workers
 * Author: Jim Cowart (http://ifandelse.com)
 * Version: v0.0.1
 * Url: https://github.com/ifandelse/externa.js
 * License(s): MIT
 */(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("machina"), require("debug"));
	else if(typeof define === 'function' && define.amd)
		define(["machina", "debug"], factory);
	else if(typeof exports === 'object')
		exports["externa"] = factory(require("machina"), require("debug"));
	else
		root["externa"] = factory(root["machina"], root["debug"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE__264__, __WEBPACK_EXTERNAL_MODULE__682__) {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 682:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__682__;

/***/ }),

/***/ 264:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__264__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ src)
});

;// CONCATENATED MODULE: ./src/helpers.js
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }


function createUUID() {
  var s = [];
  var hexDigits = "0123456789abcdef";
  /* eslint-disable no-magic-numbers */

  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }

  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010

  /* jshint ignore:start */

  s[19] = hexDigits.substr(s[19] & 0x3 | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01

  /* jshint ignore:end */

  s[8] = s[13] = s[18] = s[23] = "-";
  /* eslint-enable no-magic-numbers */

  return s.join("");
}
function getExternals() {
  if (state.isWorker) {
    return [this]; // eslint-disable-line no-invalid-this
  }

  var targets = _toConsumableArray(document.getElementsByTagName("iframe")).map(function (i) {
    return i.contentWindow;
  });

  if (window.parent && window.parent !== window) {
    targets.push(window.parent);
  } // TODO: determine if we need to include workers here?


  return targets;
}
;// CONCATENATED MODULE: ./src/state.js

/* harmony default export */ const state = ({
  instanceId: createUUID(),
  isWorker: typeof window === "undefined" && !!postMessage && !!location,
  knownExternals: new Map()
});
// EXTERNAL MODULE: external "machina"
var external_machina_ = __webpack_require__(264);
var external_machina_default = /*#__PURE__*/__webpack_require__.n(external_machina_);
// EXTERNAL MODULE: external "debug"
var external_debug_ = __webpack_require__(682);
var external_debug_default = /*#__PURE__*/__webpack_require__.n(external_debug_);
;// CONCATENATED MODULE: ./src/logger.js


var _logger = function _logger() {};

function setLogNamespace(namespace) {
  _logger = external_debug_default()("externa:".concat(namespace));
}

;// CONCATENATED MODULE: ./src/ExternaRemoteProxy.js




var _userHandlers = {};
function setHandlers(handlers) {
  _userHandlers = handlers;
}

var packingSlips = {
  ping: function ping() {
    return {
      type: "externa.ping",
      timeStamp: new Date(),
      ticket: createUUID(),
      instanceId: state.instanceId
    };
  },
  pong: function pong(_ref) {
    var instanceId = _ref.instanceId,
        timeStamp = _ref.timeStamp,
        ticket = _ref.ticket;
    return {
      type: "externa.pong",
      instanceId: state.instanceId,
      timeStamp: new Date(),
      pingData: {
        instanceId: instanceId,
        timeStamp: timeStamp,
        ticket: ticket
      }
    };
  },
  message: function message(type, _message) {
    return {
      type: "externa.message",
      instanceId: state.instanceId,
      timeStamp: new Date(),
      envelope: {
        type: type,
        message: _message
      }
    };
  },
  disconnect: function disconnect() {
    return {
      type: "externa.disconnect",
      timeStamp: new Date(),
      instanceId: state.instanceId
    };
  }
};
var ExternaRemoteProxy = external_machina_default().Fsm.extend({
  initialize: function initialize(options, target, instanceId) {
    this.target = target;
    this.instanceId = instanceId;
    this.handshakeComplete = false;

    this.logger = function (msg) {
      _logger("[remote-proxy] ".concat(msg));
    };
  },
  initialState: "uninitialized",
  states: {
    uninitialized: {
      disconnect: "disconnected",
      sendPing: "pinging",
      receivePing: function receivePing(ping) {
        this.instanceId = ping.instanceId;
      },
      sendPong: function sendPong() {
        this.deferUntilTransition("ponging");
        this.transition("ponging");
      }
    },
    pinging: {
      _onEnter: function _onEnter() {
        var payload = packingSlips.ping();
        this.logger("pinging: ".concat(JSON.stringify(payload)));
        this.send(payload);
      },
      disconnect: "disconnected",
      receivePong: function receivePong(pong) {
        this.instanceId = pong.instanceId;
        this.handshakeComplete = true;
        this.logger("completed handshake with ".concat(this.instanceId));
        this.transition("connected");
      },
      receivePing: function receivePing(ping) {
        this.instanceId = ping.instanceId;
      },
      sendPong: function sendPong() {
        this.deferUntilTransition("ponging");
        this.transition("ponging");
      },
      receiveMessage: function receiveMessage() {
        this.deferUntilTransition("connected");
      },
      sendMessage: function sendMessage() {
        this.deferUntilTransition("connected");
      }
    },
    ponging: {
      sendPong: function sendPong(ping) {
        var payload = packingSlips.pong(ping);
        this.logger("ponging: ".concat(JSON.stringify(payload)));
        this.send(payload);
        this.transition("connected");
      }
    },
    connected: {
      ping: "pinging",
      disconnect: "disconnected",
      receiveMessage: function receiveMessage(envelope) {
        this.logger("received message from ".concat(this.instanceId, " ").concat(JSON.stringify(envelope)));
        var handler = _userHandlers[envelope.type];

        if (handler) {
          handler(envelope.message);
        } else {
          this.logger("no user handler for: ".concat(JSON.stringify(envelope)));
        }
      },
      sendMessage: function sendMessage(type, msg) {
        var payload = packingSlips.message(type, msg);
        this.logger("sending msg: ".concat(JSON.stringify(payload)));
        this.send(payload);
      }
    },
    disconnected: {
      _onEnter: function _onEnter() {
        var payload = packingSlips.disconnect();
        this.logger("sending disconnect: ".concat(JSON.stringify(payload)));
        this.send(payload);
      }
    }
  },
  sendPing: function sendPing() {
    this.handle("sendPing");
  },
  receivePing: function receivePing(ping) {
    this.handle("receivePing", ping);
  },
  sendPong: function sendPong(ping) {
    this.handle("sendPong", ping);
  },
  receivePong: function receivePong(pong) {
    this.handle("receivePong", pong);
  },
  sendMessage: function sendMessage(type, msg) {
    this.handle("sendMessage", type, msg);
  },
  receiveMessage: function receiveMessage(_ref2) {
    var envelope = _ref2.envelope;
    this.handle("receiveMessage", envelope);
  },
  send: function send(payload) {
    this.target.postMessage({
      externa: true,
      payload: payload
    });
  },
  disconnect: function disconnect() {
    this.handle("disconnect");
  }
});

;// CONCATENATED MODULE: ./src/windowAdapterFsm.js


var fsmInstance;
function getWindowAdapterFsm() {
  if (!fsmInstance) {
    fsmInstance = new (external_machina_default()).Fsm({
      initialize: function initialize() {
        this.logger = function (msg) {
          _logger("[window-adapter-fsm] ".concat(msg));
        };
      },
      initialState: "uninitialized",
      states: {
        uninitialized: {
          init: "ready",
          "externa.message": function externaMessage() {
            this.logger("externa has not been initialized, but is receiving messages. Be sure to call externa.init().");
            this.deferUntilTransition("ready");
          },
          "externa.ping": function externaPing() {
            this.logger("externa has not been initialized, but is receiving pings. Be sure to call externa.init().");
            this.deferUntilTransition("ready");
          },
          "externa.pong": function externaPong() {
            this.logger("externa has not been initialized, but is receiving pongs. Be sure to call externa.init().");
            this.deferUntilTransition("ready");
          }
        },
        ready: {
          pause: "paused",
          "externa.message": function externaMessage(_ref) {
            var data = _ref.data,
                remote = _ref.remote;
            this.logger("NORMAL MESSAGE FROM:", data.instanceId, remote.state);
            remote.receiveMessage(data);
          },
          "externa.ping": function externaPing(_ref2) {
            var data = _ref2.data,
                remote = _ref2.remote;
            this.logger("PING MESSAGE FROM:", data.instanceId, remote.state);
            remote.receivePing(data);
            remote.sendPong(data);
          },
          "externa.pong": function externaPong(_ref3) {
            var data = _ref3.data,
                remote = _ref3.remote;
            this.logger("PONG MESSAGE FROM:", data.instanceId, remote.state);
            remote.receivePong(data);
          }
        },
        paused: {
          resume: "ready",
          "externa.message": function externaMessage() {
            this.deferUntilTransition("ready");
          },
          "externa.ping": function externaPing() {
            this.deferUntilTransition("ready");
          },
          "externa.pong": function externaPong() {
            this.deferUntilTransition("ready");
          }
        }
      },
      init: function init() {
        this.handle("init");
      },
      pause: function pause() {
        this.handle("pause");
      },
      resume: function resume() {
        this.handle("resume");
      },
      handleMessage: function handleMessage(type, options) {
        this.handle(type, options);
      }
    });
  }

  return fsmInstance;
}
;// CONCATENATED MODULE: ./src/inbound.js




function postMessageListener(event) {
  if (event.data.externa) {
    var source = event.source;
    var payload = event.data.payload;
    var remote = state.knownExternals.get(source);

    if (!remote) {
      _logger("received externa message from unknown source: ".concat(payload.instanceId));
      remote = new ExternaRemoteProxy({}, source, payload.instanceId);
      state.knownExternals.set(source, remote);
    }

    getWindowAdapterFsm().handleMessage(payload.type, {
      data: payload,
      remote: remote
    });
  }
}
;// CONCATENATED MODULE: ./src/index.js
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || src_unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = src_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function src_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return src_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return src_arrayLikeToArray(o, minLen); }

function src_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }







window.addEventListener("message", postMessageListener);
/* harmony default export */ const src = ({
  knownExternals: state.knownExternals,
  init: function init(options) {
    state.instanceId = options.instanceId || state.instanceId;
    setLogNamespace(state.instanceId);
    _logger("initializing");

    if (options.handlers) {
      setHandlers(options.handlers);
    } else {
      // eslint-disable-next-line no-console
      console.warn("externa has not been configured with user handlers, so no inbound messages will be handled");
    }

    getWindowAdapterFsm().init();
  },
  connect: function connect() {
    _logger("connecting");
    getExternals().forEach(function (external) {
      var proxy = state.knownExternals.get(external);

      if (!proxy) {
        proxy = new ExternaRemoteProxy({}, external);
        state.knownExternals.set(external, proxy);
      }

      proxy.sendPing();
    });
  },
  // Intentionally not yet implemented
  connectWorker: function connectWorker() {},
  disconnect: function disconnect() {
    _logger("disconnecting");
    window.removeEventListener("message", postMessageListener); // eslint-disable-next-line no-unused-vars

    var _iterator = _createForOfIteratorHelper(state.knownExternals),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = _slicedToArray(_step.value, 2),
            key = _step$value[0],
            external = _step$value[1];

        external.disconnect();
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    state.knownExternals.clear();
  },
  resumeUponCompletion: function resumeUponCompletion(workToBeDone) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // TODO: throw here if FSM is not in ready state
              getWindowAdapterFsm().pause();
              _context.next = 3;
              return workToBeDone();

            case 3:
              getWindowAdapterFsm().resume();

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  sendMessage: function sendMessage(type, msg) {
    // eslint-disable-next-line no-unused-vars
    var _iterator2 = _createForOfIteratorHelper(state.knownExternals),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _step2$value = _slicedToArray(_step2.value, 2),
            key = _step2$value[0],
            external = _step2$value[1];

        external.sendMessage(type, msg);
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }
});
})();

__webpack_exports__ = __webpack_exports__.default;
/******/ 	return __webpack_exports__;
/******/ })()
;
});