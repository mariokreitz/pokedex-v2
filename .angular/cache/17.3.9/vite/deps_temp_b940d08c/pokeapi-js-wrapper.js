import {
  __commonJS,
  __require,
  __toESM
} from "./chunk-PZQZAEDH.js";

// node_modules/localforage/dist/localforage.js
var require_localforage = __commonJS({
  "node_modules/localforage/dist/localforage.js"(exports, module) {
    (function(f) {
      if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = f();
      } else if (typeof define === "function" && define.amd) {
        define([], f);
      } else {
        var g;
        if (typeof window !== "undefined") {
          g = window;
        } else if (typeof global !== "undefined") {
          g = global;
        } else if (typeof self !== "undefined") {
          g = self;
        } else {
          g = this;
        }
        g.localforage = f();
      }
    })(function() {
      var define2, module2, exports2;
      return function e(t, n, r) {
        function s(o2, u) {
          if (!n[o2]) {
            if (!t[o2]) {
              var a = typeof __require == "function" && __require;
              if (!u && a)
                return a(o2, true);
              if (i)
                return i(o2, true);
              var f = new Error("Cannot find module '" + o2 + "'");
              throw f.code = "MODULE_NOT_FOUND", f;
            }
            var l = n[o2] = { exports: {} };
            t[o2][0].call(l.exports, function(e2) {
              var n2 = t[o2][1][e2];
              return s(n2 ? n2 : e2);
            }, l, l.exports, e, t, n, r);
          }
          return n[o2].exports;
        }
        var i = typeof __require == "function" && __require;
        for (var o = 0; o < r.length; o++)
          s(r[o]);
        return s;
      }({ 1: [function(_dereq_, module3, exports3) {
        (function(global2) {
          "use strict";
          var Mutation = global2.MutationObserver || global2.WebKitMutationObserver;
          var scheduleDrain;
          {
            if (Mutation) {
              var called = 0;
              var observer = new Mutation(nextTick);
              var element = global2.document.createTextNode("");
              observer.observe(element, {
                characterData: true
              });
              scheduleDrain = function() {
                element.data = called = ++called % 2;
              };
            } else if (!global2.setImmediate && typeof global2.MessageChannel !== "undefined") {
              var channel = new global2.MessageChannel();
              channel.port1.onmessage = nextTick;
              scheduleDrain = function() {
                channel.port2.postMessage(0);
              };
            } else if ("document" in global2 && "onreadystatechange" in global2.document.createElement("script")) {
              scheduleDrain = function() {
                var scriptEl = global2.document.createElement("script");
                scriptEl.onreadystatechange = function() {
                  nextTick();
                  scriptEl.onreadystatechange = null;
                  scriptEl.parentNode.removeChild(scriptEl);
                  scriptEl = null;
                };
                global2.document.documentElement.appendChild(scriptEl);
              };
            } else {
              scheduleDrain = function() {
                setTimeout(nextTick, 0);
              };
            }
          }
          var draining;
          var queue = [];
          function nextTick() {
            draining = true;
            var i, oldQueue;
            var len = queue.length;
            while (len) {
              oldQueue = queue;
              queue = [];
              i = -1;
              while (++i < len) {
                oldQueue[i]();
              }
              len = queue.length;
            }
            draining = false;
          }
          module3.exports = immediate;
          function immediate(task) {
            if (queue.push(task) === 1 && !draining) {
              scheduleDrain();
            }
          }
        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
      }, {}], 2: [function(_dereq_, module3, exports3) {
        "use strict";
        var immediate = _dereq_(1);
        function INTERNAL() {
        }
        var handlers = {};
        var REJECTED = ["REJECTED"];
        var FULFILLED = ["FULFILLED"];
        var PENDING = ["PENDING"];
        module3.exports = Promise2;
        function Promise2(resolver) {
          if (typeof resolver !== "function") {
            throw new TypeError("resolver must be a function");
          }
          this.state = PENDING;
          this.queue = [];
          this.outcome = void 0;
          if (resolver !== INTERNAL) {
            safelyResolveThenable(this, resolver);
          }
        }
        Promise2.prototype["catch"] = function(onRejected) {
          return this.then(null, onRejected);
        };
        Promise2.prototype.then = function(onFulfilled, onRejected) {
          if (typeof onFulfilled !== "function" && this.state === FULFILLED || typeof onRejected !== "function" && this.state === REJECTED) {
            return this;
          }
          var promise = new this.constructor(INTERNAL);
          if (this.state !== PENDING) {
            var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
            unwrap(promise, resolver, this.outcome);
          } else {
            this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
          }
          return promise;
        };
        function QueueItem(promise, onFulfilled, onRejected) {
          this.promise = promise;
          if (typeof onFulfilled === "function") {
            this.onFulfilled = onFulfilled;
            this.callFulfilled = this.otherCallFulfilled;
          }
          if (typeof onRejected === "function") {
            this.onRejected = onRejected;
            this.callRejected = this.otherCallRejected;
          }
        }
        QueueItem.prototype.callFulfilled = function(value) {
          handlers.resolve(this.promise, value);
        };
        QueueItem.prototype.otherCallFulfilled = function(value) {
          unwrap(this.promise, this.onFulfilled, value);
        };
        QueueItem.prototype.callRejected = function(value) {
          handlers.reject(this.promise, value);
        };
        QueueItem.prototype.otherCallRejected = function(value) {
          unwrap(this.promise, this.onRejected, value);
        };
        function unwrap(promise, func, value) {
          immediate(function() {
            var returnValue;
            try {
              returnValue = func(value);
            } catch (e) {
              return handlers.reject(promise, e);
            }
            if (returnValue === promise) {
              handlers.reject(promise, new TypeError("Cannot resolve promise with itself"));
            } else {
              handlers.resolve(promise, returnValue);
            }
          });
        }
        handlers.resolve = function(self2, value) {
          var result = tryCatch(getThen, value);
          if (result.status === "error") {
            return handlers.reject(self2, result.value);
          }
          var thenable = result.value;
          if (thenable) {
            safelyResolveThenable(self2, thenable);
          } else {
            self2.state = FULFILLED;
            self2.outcome = value;
            var i = -1;
            var len = self2.queue.length;
            while (++i < len) {
              self2.queue[i].callFulfilled(value);
            }
          }
          return self2;
        };
        handlers.reject = function(self2, error) {
          self2.state = REJECTED;
          self2.outcome = error;
          var i = -1;
          var len = self2.queue.length;
          while (++i < len) {
            self2.queue[i].callRejected(error);
          }
          return self2;
        };
        function getThen(obj) {
          var then = obj && obj.then;
          if (obj && (typeof obj === "object" || typeof obj === "function") && typeof then === "function") {
            return function appyThen() {
              then.apply(obj, arguments);
            };
          }
        }
        function safelyResolveThenable(self2, thenable) {
          var called = false;
          function onError(value) {
            if (called) {
              return;
            }
            called = true;
            handlers.reject(self2, value);
          }
          function onSuccess(value) {
            if (called) {
              return;
            }
            called = true;
            handlers.resolve(self2, value);
          }
          function tryToUnwrap() {
            thenable(onSuccess, onError);
          }
          var result = tryCatch(tryToUnwrap);
          if (result.status === "error") {
            onError(result.value);
          }
        }
        function tryCatch(func, value) {
          var out = {};
          try {
            out.value = func(value);
            out.status = "success";
          } catch (e) {
            out.status = "error";
            out.value = e;
          }
          return out;
        }
        Promise2.resolve = resolve;
        function resolve(value) {
          if (value instanceof this) {
            return value;
          }
          return handlers.resolve(new this(INTERNAL), value);
        }
        Promise2.reject = reject;
        function reject(reason) {
          var promise = new this(INTERNAL);
          return handlers.reject(promise, reason);
        }
        Promise2.all = all;
        function all(iterable) {
          var self2 = this;
          if (Object.prototype.toString.call(iterable) !== "[object Array]") {
            return this.reject(new TypeError("must be an array"));
          }
          var len = iterable.length;
          var called = false;
          if (!len) {
            return this.resolve([]);
          }
          var values = new Array(len);
          var resolved = 0;
          var i = -1;
          var promise = new this(INTERNAL);
          while (++i < len) {
            allResolver(iterable[i], i);
          }
          return promise;
          function allResolver(value, i2) {
            self2.resolve(value).then(resolveFromAll, function(error) {
              if (!called) {
                called = true;
                handlers.reject(promise, error);
              }
            });
            function resolveFromAll(outValue) {
              values[i2] = outValue;
              if (++resolved === len && !called) {
                called = true;
                handlers.resolve(promise, values);
              }
            }
          }
        }
        Promise2.race = race;
        function race(iterable) {
          var self2 = this;
          if (Object.prototype.toString.call(iterable) !== "[object Array]") {
            return this.reject(new TypeError("must be an array"));
          }
          var len = iterable.length;
          var called = false;
          if (!len) {
            return this.resolve([]);
          }
          var i = -1;
          var promise = new this(INTERNAL);
          while (++i < len) {
            resolver(iterable[i]);
          }
          return promise;
          function resolver(value) {
            self2.resolve(value).then(function(response) {
              if (!called) {
                called = true;
                handlers.resolve(promise, response);
              }
            }, function(error) {
              if (!called) {
                called = true;
                handlers.reject(promise, error);
              }
            });
          }
        }
      }, { "1": 1 }], 3: [function(_dereq_, module3, exports3) {
        (function(global2) {
          "use strict";
          if (typeof global2.Promise !== "function") {
            global2.Promise = _dereq_(2);
          }
        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
      }, { "2": 2 }], 4: [function(_dereq_, module3, exports3) {
        "use strict";
        var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
          return typeof obj;
        } : function(obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }
        function getIDB() {
          try {
            if (typeof indexedDB !== "undefined") {
              return indexedDB;
            }
            if (typeof webkitIndexedDB !== "undefined") {
              return webkitIndexedDB;
            }
            if (typeof mozIndexedDB !== "undefined") {
              return mozIndexedDB;
            }
            if (typeof OIndexedDB !== "undefined") {
              return OIndexedDB;
            }
            if (typeof msIndexedDB !== "undefined") {
              return msIndexedDB;
            }
          } catch (e) {
            return;
          }
        }
        var idb = getIDB();
        function isIndexedDBValid() {
          try {
            if (!idb || !idb.open) {
              return false;
            }
            var isSafari = typeof openDatabase !== "undefined" && /(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) && !/BlackBerry/.test(navigator.platform);
            var hasFetch = typeof fetch === "function" && fetch.toString().indexOf("[native code") !== -1;
            return (!isSafari || hasFetch) && typeof indexedDB !== "undefined" && // some outdated implementations of IDB that appear on Samsung
            // and HTC Android devices <4.4 are missing IDBKeyRange
            // See: https://github.com/mozilla/localForage/issues/128
            // See: https://github.com/mozilla/localForage/issues/272
            typeof IDBKeyRange !== "undefined";
          } catch (e) {
            return false;
          }
        }
        function createBlob(parts, properties) {
          parts = parts || [];
          properties = properties || {};
          try {
            return new Blob(parts, properties);
          } catch (e) {
            if (e.name !== "TypeError") {
              throw e;
            }
            var Builder = typeof BlobBuilder !== "undefined" ? BlobBuilder : typeof MSBlobBuilder !== "undefined" ? MSBlobBuilder : typeof MozBlobBuilder !== "undefined" ? MozBlobBuilder : WebKitBlobBuilder;
            var builder = new Builder();
            for (var i = 0; i < parts.length; i += 1) {
              builder.append(parts[i]);
            }
            return builder.getBlob(properties.type);
          }
        }
        if (typeof Promise === "undefined") {
          _dereq_(3);
        }
        var Promise$1 = Promise;
        function executeCallback(promise, callback) {
          if (callback) {
            promise.then(function(result) {
              callback(null, result);
            }, function(error) {
              callback(error);
            });
          }
        }
        function executeTwoCallbacks(promise, callback, errorCallback) {
          if (typeof callback === "function") {
            promise.then(callback);
          }
          if (typeof errorCallback === "function") {
            promise["catch"](errorCallback);
          }
        }
        function normalizeKey(key2) {
          if (typeof key2 !== "string") {
            console.warn(key2 + " used as a key, but it is not a string.");
            key2 = String(key2);
          }
          return key2;
        }
        function getCallback() {
          if (arguments.length && typeof arguments[arguments.length - 1] === "function") {
            return arguments[arguments.length - 1];
          }
        }
        var DETECT_BLOB_SUPPORT_STORE = "local-forage-detect-blob-support";
        var supportsBlobs = void 0;
        var dbContexts = {};
        var toString = Object.prototype.toString;
        var READ_ONLY = "readonly";
        var READ_WRITE = "readwrite";
        function _binStringToArrayBuffer(bin) {
          var length2 = bin.length;
          var buf = new ArrayBuffer(length2);
          var arr = new Uint8Array(buf);
          for (var i = 0; i < length2; i++) {
            arr[i] = bin.charCodeAt(i);
          }
          return buf;
        }
        function _checkBlobSupportWithoutCaching(idb2) {
          return new Promise$1(function(resolve) {
            var txn = idb2.transaction(DETECT_BLOB_SUPPORT_STORE, READ_WRITE);
            var blob = createBlob([""]);
            txn.objectStore(DETECT_BLOB_SUPPORT_STORE).put(blob, "key");
            txn.onabort = function(e) {
              e.preventDefault();
              e.stopPropagation();
              resolve(false);
            };
            txn.oncomplete = function() {
              var matchedChrome = navigator.userAgent.match(/Chrome\/(\d+)/);
              var matchedEdge = navigator.userAgent.match(/Edge\//);
              resolve(matchedEdge || !matchedChrome || parseInt(matchedChrome[1], 10) >= 43);
            };
          })["catch"](function() {
            return false;
          });
        }
        function _checkBlobSupport(idb2) {
          if (typeof supportsBlobs === "boolean") {
            return Promise$1.resolve(supportsBlobs);
          }
          return _checkBlobSupportWithoutCaching(idb2).then(function(value) {
            supportsBlobs = value;
            return supportsBlobs;
          });
        }
        function _deferReadiness(dbInfo) {
          var dbContext = dbContexts[dbInfo.name];
          var deferredOperation = {};
          deferredOperation.promise = new Promise$1(function(resolve, reject) {
            deferredOperation.resolve = resolve;
            deferredOperation.reject = reject;
          });
          dbContext.deferredOperations.push(deferredOperation);
          if (!dbContext.dbReady) {
            dbContext.dbReady = deferredOperation.promise;
          } else {
            dbContext.dbReady = dbContext.dbReady.then(function() {
              return deferredOperation.promise;
            });
          }
        }
        function _advanceReadiness(dbInfo) {
          var dbContext = dbContexts[dbInfo.name];
          var deferredOperation = dbContext.deferredOperations.pop();
          if (deferredOperation) {
            deferredOperation.resolve();
            return deferredOperation.promise;
          }
        }
        function _rejectReadiness(dbInfo, err) {
          var dbContext = dbContexts[dbInfo.name];
          var deferredOperation = dbContext.deferredOperations.pop();
          if (deferredOperation) {
            deferredOperation.reject(err);
            return deferredOperation.promise;
          }
        }
        function _getConnection(dbInfo, upgradeNeeded) {
          return new Promise$1(function(resolve, reject) {
            dbContexts[dbInfo.name] = dbContexts[dbInfo.name] || createDbContext();
            if (dbInfo.db) {
              if (upgradeNeeded) {
                _deferReadiness(dbInfo);
                dbInfo.db.close();
              } else {
                return resolve(dbInfo.db);
              }
            }
            var dbArgs = [dbInfo.name];
            if (upgradeNeeded) {
              dbArgs.push(dbInfo.version);
            }
            var openreq = idb.open.apply(idb, dbArgs);
            if (upgradeNeeded) {
              openreq.onupgradeneeded = function(e) {
                var db = openreq.result;
                try {
                  db.createObjectStore(dbInfo.storeName);
                  if (e.oldVersion <= 1) {
                    db.createObjectStore(DETECT_BLOB_SUPPORT_STORE);
                  }
                } catch (ex) {
                  if (ex.name === "ConstraintError") {
                    console.warn('The database "' + dbInfo.name + '" has been upgraded from version ' + e.oldVersion + " to version " + e.newVersion + ', but the storage "' + dbInfo.storeName + '" already exists.');
                  } else {
                    throw ex;
                  }
                }
              };
            }
            openreq.onerror = function(e) {
              e.preventDefault();
              reject(openreq.error);
            };
            openreq.onsuccess = function() {
              var db = openreq.result;
              db.onversionchange = function(e) {
                e.target.close();
              };
              resolve(db);
              _advanceReadiness(dbInfo);
            };
          });
        }
        function _getOriginalConnection(dbInfo) {
          return _getConnection(dbInfo, false);
        }
        function _getUpgradedConnection(dbInfo) {
          return _getConnection(dbInfo, true);
        }
        function _isUpgradeNeeded(dbInfo, defaultVersion) {
          if (!dbInfo.db) {
            return true;
          }
          var isNewStore = !dbInfo.db.objectStoreNames.contains(dbInfo.storeName);
          var isDowngrade = dbInfo.version < dbInfo.db.version;
          var isUpgrade = dbInfo.version > dbInfo.db.version;
          if (isDowngrade) {
            if (dbInfo.version !== defaultVersion) {
              console.warn('The database "' + dbInfo.name + `" can't be downgraded from version ` + dbInfo.db.version + " to version " + dbInfo.version + ".");
            }
            dbInfo.version = dbInfo.db.version;
          }
          if (isUpgrade || isNewStore) {
            if (isNewStore) {
              var incVersion = dbInfo.db.version + 1;
              if (incVersion > dbInfo.version) {
                dbInfo.version = incVersion;
              }
            }
            return true;
          }
          return false;
        }
        function _encodeBlob(blob) {
          return new Promise$1(function(resolve, reject) {
            var reader = new FileReader();
            reader.onerror = reject;
            reader.onloadend = function(e) {
              var base64 = btoa(e.target.result || "");
              resolve({
                __local_forage_encoded_blob: true,
                data: base64,
                type: blob.type
              });
            };
            reader.readAsBinaryString(blob);
          });
        }
        function _decodeBlob(encodedBlob) {
          var arrayBuff = _binStringToArrayBuffer(atob(encodedBlob.data));
          return createBlob([arrayBuff], { type: encodedBlob.type });
        }
        function _isEncodedBlob(value) {
          return value && value.__local_forage_encoded_blob;
        }
        function _fullyReady(callback) {
          var self2 = this;
          var promise = self2._initReady().then(function() {
            var dbContext = dbContexts[self2._dbInfo.name];
            if (dbContext && dbContext.dbReady) {
              return dbContext.dbReady;
            }
          });
          executeTwoCallbacks(promise, callback, callback);
          return promise;
        }
        function _tryReconnect(dbInfo) {
          _deferReadiness(dbInfo);
          var dbContext = dbContexts[dbInfo.name];
          var forages = dbContext.forages;
          for (var i = 0; i < forages.length; i++) {
            var forage = forages[i];
            if (forage._dbInfo.db) {
              forage._dbInfo.db.close();
              forage._dbInfo.db = null;
            }
          }
          dbInfo.db = null;
          return _getOriginalConnection(dbInfo).then(function(db) {
            dbInfo.db = db;
            if (_isUpgradeNeeded(dbInfo)) {
              return _getUpgradedConnection(dbInfo);
            }
            return db;
          }).then(function(db) {
            dbInfo.db = dbContext.db = db;
            for (var i2 = 0; i2 < forages.length; i2++) {
              forages[i2]._dbInfo.db = db;
            }
          })["catch"](function(err) {
            _rejectReadiness(dbInfo, err);
            throw err;
          });
        }
        function createTransaction(dbInfo, mode, callback, retries) {
          if (retries === void 0) {
            retries = 1;
          }
          try {
            var tx = dbInfo.db.transaction(dbInfo.storeName, mode);
            callback(null, tx);
          } catch (err) {
            if (retries > 0 && (!dbInfo.db || err.name === "InvalidStateError" || err.name === "NotFoundError")) {
              return Promise$1.resolve().then(function() {
                if (!dbInfo.db || err.name === "NotFoundError" && !dbInfo.db.objectStoreNames.contains(dbInfo.storeName) && dbInfo.version <= dbInfo.db.version) {
                  if (dbInfo.db) {
                    dbInfo.version = dbInfo.db.version + 1;
                  }
                  return _getUpgradedConnection(dbInfo);
                }
              }).then(function() {
                return _tryReconnect(dbInfo).then(function() {
                  createTransaction(dbInfo, mode, callback, retries - 1);
                });
              })["catch"](callback);
            }
            callback(err);
          }
        }
        function createDbContext() {
          return {
            // Running localForages sharing a database.
            forages: [],
            // Shared database.
            db: null,
            // Database readiness (promise).
            dbReady: null,
            // Deferred operations on the database.
            deferredOperations: []
          };
        }
        function _initStorage(options) {
          var self2 = this;
          var dbInfo = {
            db: null
          };
          if (options) {
            for (var i in options) {
              dbInfo[i] = options[i];
            }
          }
          var dbContext = dbContexts[dbInfo.name];
          if (!dbContext) {
            dbContext = createDbContext();
            dbContexts[dbInfo.name] = dbContext;
          }
          dbContext.forages.push(self2);
          if (!self2._initReady) {
            self2._initReady = self2.ready;
            self2.ready = _fullyReady;
          }
          var initPromises = [];
          function ignoreErrors() {
            return Promise$1.resolve();
          }
          for (var j = 0; j < dbContext.forages.length; j++) {
            var forage = dbContext.forages[j];
            if (forage !== self2) {
              initPromises.push(forage._initReady()["catch"](ignoreErrors));
            }
          }
          var forages = dbContext.forages.slice(0);
          return Promise$1.all(initPromises).then(function() {
            dbInfo.db = dbContext.db;
            return _getOriginalConnection(dbInfo);
          }).then(function(db) {
            dbInfo.db = db;
            if (_isUpgradeNeeded(dbInfo, self2._defaultConfig.version)) {
              return _getUpgradedConnection(dbInfo);
            }
            return db;
          }).then(function(db) {
            dbInfo.db = dbContext.db = db;
            self2._dbInfo = dbInfo;
            for (var k = 0; k < forages.length; k++) {
              var forage2 = forages[k];
              if (forage2 !== self2) {
                forage2._dbInfo.db = dbInfo.db;
                forage2._dbInfo.version = dbInfo.version;
              }
            }
          });
        }
        function getItem(key2, callback) {
          var self2 = this;
          key2 = normalizeKey(key2);
          var promise = new Promise$1(function(resolve, reject) {
            self2.ready().then(function() {
              createTransaction(self2._dbInfo, READ_ONLY, function(err, transaction) {
                if (err) {
                  return reject(err);
                }
                try {
                  var store = transaction.objectStore(self2._dbInfo.storeName);
                  var req = store.get(key2);
                  req.onsuccess = function() {
                    var value = req.result;
                    if (value === void 0) {
                      value = null;
                    }
                    if (_isEncodedBlob(value)) {
                      value = _decodeBlob(value);
                    }
                    resolve(value);
                  };
                  req.onerror = function() {
                    reject(req.error);
                  };
                } catch (e) {
                  reject(e);
                }
              });
            })["catch"](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function iterate(iterator, callback) {
          var self2 = this;
          var promise = new Promise$1(function(resolve, reject) {
            self2.ready().then(function() {
              createTransaction(self2._dbInfo, READ_ONLY, function(err, transaction) {
                if (err) {
                  return reject(err);
                }
                try {
                  var store = transaction.objectStore(self2._dbInfo.storeName);
                  var req = store.openCursor();
                  var iterationNumber = 1;
                  req.onsuccess = function() {
                    var cursor = req.result;
                    if (cursor) {
                      var value = cursor.value;
                      if (_isEncodedBlob(value)) {
                        value = _decodeBlob(value);
                      }
                      var result = iterator(value, cursor.key, iterationNumber++);
                      if (result !== void 0) {
                        resolve(result);
                      } else {
                        cursor["continue"]();
                      }
                    } else {
                      resolve();
                    }
                  };
                  req.onerror = function() {
                    reject(req.error);
                  };
                } catch (e) {
                  reject(e);
                }
              });
            })["catch"](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function setItem(key2, value, callback) {
          var self2 = this;
          key2 = normalizeKey(key2);
          var promise = new Promise$1(function(resolve, reject) {
            var dbInfo;
            self2.ready().then(function() {
              dbInfo = self2._dbInfo;
              if (toString.call(value) === "[object Blob]") {
                return _checkBlobSupport(dbInfo.db).then(function(blobSupport) {
                  if (blobSupport) {
                    return value;
                  }
                  return _encodeBlob(value);
                });
              }
              return value;
            }).then(function(value2) {
              createTransaction(self2._dbInfo, READ_WRITE, function(err, transaction) {
                if (err) {
                  return reject(err);
                }
                try {
                  var store = transaction.objectStore(self2._dbInfo.storeName);
                  if (value2 === null) {
                    value2 = void 0;
                  }
                  var req = store.put(value2, key2);
                  transaction.oncomplete = function() {
                    if (value2 === void 0) {
                      value2 = null;
                    }
                    resolve(value2);
                  };
                  transaction.onabort = transaction.onerror = function() {
                    var err2 = req.error ? req.error : req.transaction.error;
                    reject(err2);
                  };
                } catch (e) {
                  reject(e);
                }
              });
            })["catch"](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function removeItem(key2, callback) {
          var self2 = this;
          key2 = normalizeKey(key2);
          var promise = new Promise$1(function(resolve, reject) {
            self2.ready().then(function() {
              createTransaction(self2._dbInfo, READ_WRITE, function(err, transaction) {
                if (err) {
                  return reject(err);
                }
                try {
                  var store = transaction.objectStore(self2._dbInfo.storeName);
                  var req = store["delete"](key2);
                  transaction.oncomplete = function() {
                    resolve();
                  };
                  transaction.onerror = function() {
                    reject(req.error);
                  };
                  transaction.onabort = function() {
                    var err2 = req.error ? req.error : req.transaction.error;
                    reject(err2);
                  };
                } catch (e) {
                  reject(e);
                }
              });
            })["catch"](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function clear(callback) {
          var self2 = this;
          var promise = new Promise$1(function(resolve, reject) {
            self2.ready().then(function() {
              createTransaction(self2._dbInfo, READ_WRITE, function(err, transaction) {
                if (err) {
                  return reject(err);
                }
                try {
                  var store = transaction.objectStore(self2._dbInfo.storeName);
                  var req = store.clear();
                  transaction.oncomplete = function() {
                    resolve();
                  };
                  transaction.onabort = transaction.onerror = function() {
                    var err2 = req.error ? req.error : req.transaction.error;
                    reject(err2);
                  };
                } catch (e) {
                  reject(e);
                }
              });
            })["catch"](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function length(callback) {
          var self2 = this;
          var promise = new Promise$1(function(resolve, reject) {
            self2.ready().then(function() {
              createTransaction(self2._dbInfo, READ_ONLY, function(err, transaction) {
                if (err) {
                  return reject(err);
                }
                try {
                  var store = transaction.objectStore(self2._dbInfo.storeName);
                  var req = store.count();
                  req.onsuccess = function() {
                    resolve(req.result);
                  };
                  req.onerror = function() {
                    reject(req.error);
                  };
                } catch (e) {
                  reject(e);
                }
              });
            })["catch"](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function key(n, callback) {
          var self2 = this;
          var promise = new Promise$1(function(resolve, reject) {
            if (n < 0) {
              resolve(null);
              return;
            }
            self2.ready().then(function() {
              createTransaction(self2._dbInfo, READ_ONLY, function(err, transaction) {
                if (err) {
                  return reject(err);
                }
                try {
                  var store = transaction.objectStore(self2._dbInfo.storeName);
                  var advanced = false;
                  var req = store.openKeyCursor();
                  req.onsuccess = function() {
                    var cursor = req.result;
                    if (!cursor) {
                      resolve(null);
                      return;
                    }
                    if (n === 0) {
                      resolve(cursor.key);
                    } else {
                      if (!advanced) {
                        advanced = true;
                        cursor.advance(n);
                      } else {
                        resolve(cursor.key);
                      }
                    }
                  };
                  req.onerror = function() {
                    reject(req.error);
                  };
                } catch (e) {
                  reject(e);
                }
              });
            })["catch"](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function keys(callback) {
          var self2 = this;
          var promise = new Promise$1(function(resolve, reject) {
            self2.ready().then(function() {
              createTransaction(self2._dbInfo, READ_ONLY, function(err, transaction) {
                if (err) {
                  return reject(err);
                }
                try {
                  var store = transaction.objectStore(self2._dbInfo.storeName);
                  var req = store.openKeyCursor();
                  var keys2 = [];
                  req.onsuccess = function() {
                    var cursor = req.result;
                    if (!cursor) {
                      resolve(keys2);
                      return;
                    }
                    keys2.push(cursor.key);
                    cursor["continue"]();
                  };
                  req.onerror = function() {
                    reject(req.error);
                  };
                } catch (e) {
                  reject(e);
                }
              });
            })["catch"](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function dropInstance(options, callback) {
          callback = getCallback.apply(this, arguments);
          var currentConfig = this.config();
          options = typeof options !== "function" && options || {};
          if (!options.name) {
            options.name = options.name || currentConfig.name;
            options.storeName = options.storeName || currentConfig.storeName;
          }
          var self2 = this;
          var promise;
          if (!options.name) {
            promise = Promise$1.reject("Invalid arguments");
          } else {
            var isCurrentDb = options.name === currentConfig.name && self2._dbInfo.db;
            var dbPromise = isCurrentDb ? Promise$1.resolve(self2._dbInfo.db) : _getOriginalConnection(options).then(function(db) {
              var dbContext = dbContexts[options.name];
              var forages = dbContext.forages;
              dbContext.db = db;
              for (var i = 0; i < forages.length; i++) {
                forages[i]._dbInfo.db = db;
              }
              return db;
            });
            if (!options.storeName) {
              promise = dbPromise.then(function(db) {
                _deferReadiness(options);
                var dbContext = dbContexts[options.name];
                var forages = dbContext.forages;
                db.close();
                for (var i = 0; i < forages.length; i++) {
                  var forage = forages[i];
                  forage._dbInfo.db = null;
                }
                var dropDBPromise = new Promise$1(function(resolve, reject) {
                  var req = idb.deleteDatabase(options.name);
                  req.onerror = function() {
                    var db2 = req.result;
                    if (db2) {
                      db2.close();
                    }
                    reject(req.error);
                  };
                  req.onblocked = function() {
                    console.warn('dropInstance blocked for database "' + options.name + '" until all open connections are closed');
                  };
                  req.onsuccess = function() {
                    var db2 = req.result;
                    if (db2) {
                      db2.close();
                    }
                    resolve(db2);
                  };
                });
                return dropDBPromise.then(function(db2) {
                  dbContext.db = db2;
                  for (var i2 = 0; i2 < forages.length; i2++) {
                    var _forage = forages[i2];
                    _advanceReadiness(_forage._dbInfo);
                  }
                })["catch"](function(err) {
                  (_rejectReadiness(options, err) || Promise$1.resolve())["catch"](function() {
                  });
                  throw err;
                });
              });
            } else {
              promise = dbPromise.then(function(db) {
                if (!db.objectStoreNames.contains(options.storeName)) {
                  return;
                }
                var newVersion = db.version + 1;
                _deferReadiness(options);
                var dbContext = dbContexts[options.name];
                var forages = dbContext.forages;
                db.close();
                for (var i = 0; i < forages.length; i++) {
                  var forage = forages[i];
                  forage._dbInfo.db = null;
                  forage._dbInfo.version = newVersion;
                }
                var dropObjectPromise = new Promise$1(function(resolve, reject) {
                  var req = idb.open(options.name, newVersion);
                  req.onerror = function(err) {
                    var db2 = req.result;
                    db2.close();
                    reject(err);
                  };
                  req.onupgradeneeded = function() {
                    var db2 = req.result;
                    db2.deleteObjectStore(options.storeName);
                  };
                  req.onsuccess = function() {
                    var db2 = req.result;
                    db2.close();
                    resolve(db2);
                  };
                });
                return dropObjectPromise.then(function(db2) {
                  dbContext.db = db2;
                  for (var j = 0; j < forages.length; j++) {
                    var _forage2 = forages[j];
                    _forage2._dbInfo.db = db2;
                    _advanceReadiness(_forage2._dbInfo);
                  }
                })["catch"](function(err) {
                  (_rejectReadiness(options, err) || Promise$1.resolve())["catch"](function() {
                  });
                  throw err;
                });
              });
            }
          }
          executeCallback(promise, callback);
          return promise;
        }
        var asyncStorage = {
          _driver: "asyncStorage",
          _initStorage,
          _support: isIndexedDBValid(),
          iterate,
          getItem,
          setItem,
          removeItem,
          clear,
          length,
          key,
          keys,
          dropInstance
        };
        function isWebSQLValid() {
          return typeof openDatabase === "function";
        }
        var BASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var BLOB_TYPE_PREFIX = "~~local_forage_type~";
        var BLOB_TYPE_PREFIX_REGEX = /^~~local_forage_type~([^~]+)~/;
        var SERIALIZED_MARKER = "__lfsc__:";
        var SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER.length;
        var TYPE_ARRAYBUFFER = "arbf";
        var TYPE_BLOB = "blob";
        var TYPE_INT8ARRAY = "si08";
        var TYPE_UINT8ARRAY = "ui08";
        var TYPE_UINT8CLAMPEDARRAY = "uic8";
        var TYPE_INT16ARRAY = "si16";
        var TYPE_INT32ARRAY = "si32";
        var TYPE_UINT16ARRAY = "ur16";
        var TYPE_UINT32ARRAY = "ui32";
        var TYPE_FLOAT32ARRAY = "fl32";
        var TYPE_FLOAT64ARRAY = "fl64";
        var TYPE_SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER_LENGTH + TYPE_ARRAYBUFFER.length;
        var toString$1 = Object.prototype.toString;
        function stringToBuffer(serializedString) {
          var bufferLength = serializedString.length * 0.75;
          var len = serializedString.length;
          var i;
          var p = 0;
          var encoded1, encoded2, encoded3, encoded4;
          if (serializedString[serializedString.length - 1] === "=") {
            bufferLength--;
            if (serializedString[serializedString.length - 2] === "=") {
              bufferLength--;
            }
          }
          var buffer = new ArrayBuffer(bufferLength);
          var bytes = new Uint8Array(buffer);
          for (i = 0; i < len; i += 4) {
            encoded1 = BASE_CHARS.indexOf(serializedString[i]);
            encoded2 = BASE_CHARS.indexOf(serializedString[i + 1]);
            encoded3 = BASE_CHARS.indexOf(serializedString[i + 2]);
            encoded4 = BASE_CHARS.indexOf(serializedString[i + 3]);
            bytes[p++] = encoded1 << 2 | encoded2 >> 4;
            bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
            bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
          }
          return buffer;
        }
        function bufferToString(buffer) {
          var bytes = new Uint8Array(buffer);
          var base64String = "";
          var i;
          for (i = 0; i < bytes.length; i += 3) {
            base64String += BASE_CHARS[bytes[i] >> 2];
            base64String += BASE_CHARS[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
            base64String += BASE_CHARS[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
            base64String += BASE_CHARS[bytes[i + 2] & 63];
          }
          if (bytes.length % 3 === 2) {
            base64String = base64String.substring(0, base64String.length - 1) + "=";
          } else if (bytes.length % 3 === 1) {
            base64String = base64String.substring(0, base64String.length - 2) + "==";
          }
          return base64String;
        }
        function serialize(value, callback) {
          var valueType = "";
          if (value) {
            valueType = toString$1.call(value);
          }
          if (value && (valueType === "[object ArrayBuffer]" || value.buffer && toString$1.call(value.buffer) === "[object ArrayBuffer]")) {
            var buffer;
            var marker = SERIALIZED_MARKER;
            if (value instanceof ArrayBuffer) {
              buffer = value;
              marker += TYPE_ARRAYBUFFER;
            } else {
              buffer = value.buffer;
              if (valueType === "[object Int8Array]") {
                marker += TYPE_INT8ARRAY;
              } else if (valueType === "[object Uint8Array]") {
                marker += TYPE_UINT8ARRAY;
              } else if (valueType === "[object Uint8ClampedArray]") {
                marker += TYPE_UINT8CLAMPEDARRAY;
              } else if (valueType === "[object Int16Array]") {
                marker += TYPE_INT16ARRAY;
              } else if (valueType === "[object Uint16Array]") {
                marker += TYPE_UINT16ARRAY;
              } else if (valueType === "[object Int32Array]") {
                marker += TYPE_INT32ARRAY;
              } else if (valueType === "[object Uint32Array]") {
                marker += TYPE_UINT32ARRAY;
              } else if (valueType === "[object Float32Array]") {
                marker += TYPE_FLOAT32ARRAY;
              } else if (valueType === "[object Float64Array]") {
                marker += TYPE_FLOAT64ARRAY;
              } else {
                callback(new Error("Failed to get type for BinaryArray"));
              }
            }
            callback(marker + bufferToString(buffer));
          } else if (valueType === "[object Blob]") {
            var fileReader = new FileReader();
            fileReader.onload = function() {
              var str = BLOB_TYPE_PREFIX + value.type + "~" + bufferToString(this.result);
              callback(SERIALIZED_MARKER + TYPE_BLOB + str);
            };
            fileReader.readAsArrayBuffer(value);
          } else {
            try {
              callback(JSON.stringify(value));
            } catch (e) {
              console.error("Couldn't convert value into a JSON string: ", value);
              callback(null, e);
            }
          }
        }
        function deserialize(value) {
          if (value.substring(0, SERIALIZED_MARKER_LENGTH) !== SERIALIZED_MARKER) {
            return JSON.parse(value);
          }
          var serializedString = value.substring(TYPE_SERIALIZED_MARKER_LENGTH);
          var type = value.substring(SERIALIZED_MARKER_LENGTH, TYPE_SERIALIZED_MARKER_LENGTH);
          var blobType;
          if (type === TYPE_BLOB && BLOB_TYPE_PREFIX_REGEX.test(serializedString)) {
            var matcher = serializedString.match(BLOB_TYPE_PREFIX_REGEX);
            blobType = matcher[1];
            serializedString = serializedString.substring(matcher[0].length);
          }
          var buffer = stringToBuffer(serializedString);
          switch (type) {
            case TYPE_ARRAYBUFFER:
              return buffer;
            case TYPE_BLOB:
              return createBlob([buffer], { type: blobType });
            case TYPE_INT8ARRAY:
              return new Int8Array(buffer);
            case TYPE_UINT8ARRAY:
              return new Uint8Array(buffer);
            case TYPE_UINT8CLAMPEDARRAY:
              return new Uint8ClampedArray(buffer);
            case TYPE_INT16ARRAY:
              return new Int16Array(buffer);
            case TYPE_UINT16ARRAY:
              return new Uint16Array(buffer);
            case TYPE_INT32ARRAY:
              return new Int32Array(buffer);
            case TYPE_UINT32ARRAY:
              return new Uint32Array(buffer);
            case TYPE_FLOAT32ARRAY:
              return new Float32Array(buffer);
            case TYPE_FLOAT64ARRAY:
              return new Float64Array(buffer);
            default:
              throw new Error("Unkown type: " + type);
          }
        }
        var localforageSerializer = {
          serialize,
          deserialize,
          stringToBuffer,
          bufferToString
        };
        function createDbTable(t, dbInfo, callback, errorCallback) {
          t.executeSql("CREATE TABLE IF NOT EXISTS " + dbInfo.storeName + " (id INTEGER PRIMARY KEY, key unique, value)", [], callback, errorCallback);
        }
        function _initStorage$1(options) {
          var self2 = this;
          var dbInfo = {
            db: null
          };
          if (options) {
            for (var i in options) {
              dbInfo[i] = typeof options[i] !== "string" ? options[i].toString() : options[i];
            }
          }
          var dbInfoPromise = new Promise$1(function(resolve, reject) {
            try {
              dbInfo.db = openDatabase(dbInfo.name, String(dbInfo.version), dbInfo.description, dbInfo.size);
            } catch (e) {
              return reject(e);
            }
            dbInfo.db.transaction(function(t) {
              createDbTable(t, dbInfo, function() {
                self2._dbInfo = dbInfo;
                resolve();
              }, function(t2, error) {
                reject(error);
              });
            }, reject);
          });
          dbInfo.serializer = localforageSerializer;
          return dbInfoPromise;
        }
        function tryExecuteSql(t, dbInfo, sqlStatement, args, callback, errorCallback) {
          t.executeSql(sqlStatement, args, callback, function(t2, error) {
            if (error.code === error.SYNTAX_ERR) {
              t2.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name = ?", [dbInfo.storeName], function(t3, results) {
                if (!results.rows.length) {
                  createDbTable(t3, dbInfo, function() {
                    t3.executeSql(sqlStatement, args, callback, errorCallback);
                  }, errorCallback);
                } else {
                  errorCallback(t3, error);
                }
              }, errorCallback);
            } else {
              errorCallback(t2, error);
            }
          }, errorCallback);
        }
        function getItem$1(key2, callback) {
          var self2 = this;
          key2 = normalizeKey(key2);
          var promise = new Promise$1(function(resolve, reject) {
            self2.ready().then(function() {
              var dbInfo = self2._dbInfo;
              dbInfo.db.transaction(function(t) {
                tryExecuteSql(t, dbInfo, "SELECT * FROM " + dbInfo.storeName + " WHERE key = ? LIMIT 1", [key2], function(t2, results) {
                  var result = results.rows.length ? results.rows.item(0).value : null;
                  if (result) {
                    result = dbInfo.serializer.deserialize(result);
                  }
                  resolve(result);
                }, function(t2, error) {
                  reject(error);
                });
              });
            })["catch"](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function iterate$1(iterator, callback) {
          var self2 = this;
          var promise = new Promise$1(function(resolve, reject) {
            self2.ready().then(function() {
              var dbInfo = self2._dbInfo;
              dbInfo.db.transaction(function(t) {
                tryExecuteSql(t, dbInfo, "SELECT * FROM " + dbInfo.storeName, [], function(t2, results) {
                  var rows = results.rows;
                  var length2 = rows.length;
                  for (var i = 0; i < length2; i++) {
                    var item = rows.item(i);
                    var result = item.value;
                    if (result) {
                      result = dbInfo.serializer.deserialize(result);
                    }
                    result = iterator(result, item.key, i + 1);
                    if (result !== void 0) {
                      resolve(result);
                      return;
                    }
                  }
                  resolve();
                }, function(t2, error) {
                  reject(error);
                });
              });
            })["catch"](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function _setItem(key2, value, callback, retriesLeft) {
          var self2 = this;
          key2 = normalizeKey(key2);
          var promise = new Promise$1(function(resolve, reject) {
            self2.ready().then(function() {
              if (value === void 0) {
                value = null;
              }
              var originalValue = value;
              var dbInfo = self2._dbInfo;
              dbInfo.serializer.serialize(value, function(value2, error) {
                if (error) {
                  reject(error);
                } else {
                  dbInfo.db.transaction(function(t) {
                    tryExecuteSql(t, dbInfo, "INSERT OR REPLACE INTO " + dbInfo.storeName + " (key, value) VALUES (?, ?)", [key2, value2], function() {
                      resolve(originalValue);
                    }, function(t2, error2) {
                      reject(error2);
                    });
                  }, function(sqlError) {
                    if (sqlError.code === sqlError.QUOTA_ERR) {
                      if (retriesLeft > 0) {
                        resolve(_setItem.apply(self2, [key2, originalValue, callback, retriesLeft - 1]));
                        return;
                      }
                      reject(sqlError);
                    }
                  });
                }
              });
            })["catch"](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function setItem$1(key2, value, callback) {
          return _setItem.apply(this, [key2, value, callback, 1]);
        }
        function removeItem$1(key2, callback) {
          var self2 = this;
          key2 = normalizeKey(key2);
          var promise = new Promise$1(function(resolve, reject) {
            self2.ready().then(function() {
              var dbInfo = self2._dbInfo;
              dbInfo.db.transaction(function(t) {
                tryExecuteSql(t, dbInfo, "DELETE FROM " + dbInfo.storeName + " WHERE key = ?", [key2], function() {
                  resolve();
                }, function(t2, error) {
                  reject(error);
                });
              });
            })["catch"](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function clear$1(callback) {
          var self2 = this;
          var promise = new Promise$1(function(resolve, reject) {
            self2.ready().then(function() {
              var dbInfo = self2._dbInfo;
              dbInfo.db.transaction(function(t) {
                tryExecuteSql(t, dbInfo, "DELETE FROM " + dbInfo.storeName, [], function() {
                  resolve();
                }, function(t2, error) {
                  reject(error);
                });
              });
            })["catch"](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function length$1(callback) {
          var self2 = this;
          var promise = new Promise$1(function(resolve, reject) {
            self2.ready().then(function() {
              var dbInfo = self2._dbInfo;
              dbInfo.db.transaction(function(t) {
                tryExecuteSql(t, dbInfo, "SELECT COUNT(key) as c FROM " + dbInfo.storeName, [], function(t2, results) {
                  var result = results.rows.item(0).c;
                  resolve(result);
                }, function(t2, error) {
                  reject(error);
                });
              });
            })["catch"](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function key$1(n, callback) {
          var self2 = this;
          var promise = new Promise$1(function(resolve, reject) {
            self2.ready().then(function() {
              var dbInfo = self2._dbInfo;
              dbInfo.db.transaction(function(t) {
                tryExecuteSql(t, dbInfo, "SELECT key FROM " + dbInfo.storeName + " WHERE id = ? LIMIT 1", [n + 1], function(t2, results) {
                  var result = results.rows.length ? results.rows.item(0).key : null;
                  resolve(result);
                }, function(t2, error) {
                  reject(error);
                });
              });
            })["catch"](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function keys$1(callback) {
          var self2 = this;
          var promise = new Promise$1(function(resolve, reject) {
            self2.ready().then(function() {
              var dbInfo = self2._dbInfo;
              dbInfo.db.transaction(function(t) {
                tryExecuteSql(t, dbInfo, "SELECT key FROM " + dbInfo.storeName, [], function(t2, results) {
                  var keys2 = [];
                  for (var i = 0; i < results.rows.length; i++) {
                    keys2.push(results.rows.item(i).key);
                  }
                  resolve(keys2);
                }, function(t2, error) {
                  reject(error);
                });
              });
            })["catch"](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function getAllStoreNames(db) {
          return new Promise$1(function(resolve, reject) {
            db.transaction(function(t) {
              t.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name <> '__WebKitDatabaseInfoTable__'", [], function(t2, results) {
                var storeNames = [];
                for (var i = 0; i < results.rows.length; i++) {
                  storeNames.push(results.rows.item(i).name);
                }
                resolve({
                  db,
                  storeNames
                });
              }, function(t2, error) {
                reject(error);
              });
            }, function(sqlError) {
              reject(sqlError);
            });
          });
        }
        function dropInstance$1(options, callback) {
          callback = getCallback.apply(this, arguments);
          var currentConfig = this.config();
          options = typeof options !== "function" && options || {};
          if (!options.name) {
            options.name = options.name || currentConfig.name;
            options.storeName = options.storeName || currentConfig.storeName;
          }
          var self2 = this;
          var promise;
          if (!options.name) {
            promise = Promise$1.reject("Invalid arguments");
          } else {
            promise = new Promise$1(function(resolve) {
              var db;
              if (options.name === currentConfig.name) {
                db = self2._dbInfo.db;
              } else {
                db = openDatabase(options.name, "", "", 0);
              }
              if (!options.storeName) {
                resolve(getAllStoreNames(db));
              } else {
                resolve({
                  db,
                  storeNames: [options.storeName]
                });
              }
            }).then(function(operationInfo) {
              return new Promise$1(function(resolve, reject) {
                operationInfo.db.transaction(function(t) {
                  function dropTable(storeName) {
                    return new Promise$1(function(resolve2, reject2) {
                      t.executeSql("DROP TABLE IF EXISTS " + storeName, [], function() {
                        resolve2();
                      }, function(t2, error) {
                        reject2(error);
                      });
                    });
                  }
                  var operations = [];
                  for (var i = 0, len = operationInfo.storeNames.length; i < len; i++) {
                    operations.push(dropTable(operationInfo.storeNames[i]));
                  }
                  Promise$1.all(operations).then(function() {
                    resolve();
                  })["catch"](function(e) {
                    reject(e);
                  });
                }, function(sqlError) {
                  reject(sqlError);
                });
              });
            });
          }
          executeCallback(promise, callback);
          return promise;
        }
        var webSQLStorage = {
          _driver: "webSQLStorage",
          _initStorage: _initStorage$1,
          _support: isWebSQLValid(),
          iterate: iterate$1,
          getItem: getItem$1,
          setItem: setItem$1,
          removeItem: removeItem$1,
          clear: clear$1,
          length: length$1,
          key: key$1,
          keys: keys$1,
          dropInstance: dropInstance$1
        };
        function isLocalStorageValid() {
          try {
            return typeof localStorage !== "undefined" && "setItem" in localStorage && // in IE8 typeof localStorage.setItem === 'object'
            !!localStorage.setItem;
          } catch (e) {
            return false;
          }
        }
        function _getKeyPrefix(options, defaultConfig) {
          var keyPrefix = options.name + "/";
          if (options.storeName !== defaultConfig.storeName) {
            keyPrefix += options.storeName + "/";
          }
          return keyPrefix;
        }
        function checkIfLocalStorageThrows() {
          var localStorageTestKey = "_localforage_support_test";
          try {
            localStorage.setItem(localStorageTestKey, true);
            localStorage.removeItem(localStorageTestKey);
            return false;
          } catch (e) {
            return true;
          }
        }
        function _isLocalStorageUsable() {
          return !checkIfLocalStorageThrows() || localStorage.length > 0;
        }
        function _initStorage$2(options) {
          var self2 = this;
          var dbInfo = {};
          if (options) {
            for (var i in options) {
              dbInfo[i] = options[i];
            }
          }
          dbInfo.keyPrefix = _getKeyPrefix(options, self2._defaultConfig);
          if (!_isLocalStorageUsable()) {
            return Promise$1.reject();
          }
          self2._dbInfo = dbInfo;
          dbInfo.serializer = localforageSerializer;
          return Promise$1.resolve();
        }
        function clear$2(callback) {
          var self2 = this;
          var promise = self2.ready().then(function() {
            var keyPrefix = self2._dbInfo.keyPrefix;
            for (var i = localStorage.length - 1; i >= 0; i--) {
              var key2 = localStorage.key(i);
              if (key2.indexOf(keyPrefix) === 0) {
                localStorage.removeItem(key2);
              }
            }
          });
          executeCallback(promise, callback);
          return promise;
        }
        function getItem$2(key2, callback) {
          var self2 = this;
          key2 = normalizeKey(key2);
          var promise = self2.ready().then(function() {
            var dbInfo = self2._dbInfo;
            var result = localStorage.getItem(dbInfo.keyPrefix + key2);
            if (result) {
              result = dbInfo.serializer.deserialize(result);
            }
            return result;
          });
          executeCallback(promise, callback);
          return promise;
        }
        function iterate$2(iterator, callback) {
          var self2 = this;
          var promise = self2.ready().then(function() {
            var dbInfo = self2._dbInfo;
            var keyPrefix = dbInfo.keyPrefix;
            var keyPrefixLength = keyPrefix.length;
            var length2 = localStorage.length;
            var iterationNumber = 1;
            for (var i = 0; i < length2; i++) {
              var key2 = localStorage.key(i);
              if (key2.indexOf(keyPrefix) !== 0) {
                continue;
              }
              var value = localStorage.getItem(key2);
              if (value) {
                value = dbInfo.serializer.deserialize(value);
              }
              value = iterator(value, key2.substring(keyPrefixLength), iterationNumber++);
              if (value !== void 0) {
                return value;
              }
            }
          });
          executeCallback(promise, callback);
          return promise;
        }
        function key$2(n, callback) {
          var self2 = this;
          var promise = self2.ready().then(function() {
            var dbInfo = self2._dbInfo;
            var result;
            try {
              result = localStorage.key(n);
            } catch (error) {
              result = null;
            }
            if (result) {
              result = result.substring(dbInfo.keyPrefix.length);
            }
            return result;
          });
          executeCallback(promise, callback);
          return promise;
        }
        function keys$2(callback) {
          var self2 = this;
          var promise = self2.ready().then(function() {
            var dbInfo = self2._dbInfo;
            var length2 = localStorage.length;
            var keys2 = [];
            for (var i = 0; i < length2; i++) {
              var itemKey = localStorage.key(i);
              if (itemKey.indexOf(dbInfo.keyPrefix) === 0) {
                keys2.push(itemKey.substring(dbInfo.keyPrefix.length));
              }
            }
            return keys2;
          });
          executeCallback(promise, callback);
          return promise;
        }
        function length$2(callback) {
          var self2 = this;
          var promise = self2.keys().then(function(keys2) {
            return keys2.length;
          });
          executeCallback(promise, callback);
          return promise;
        }
        function removeItem$2(key2, callback) {
          var self2 = this;
          key2 = normalizeKey(key2);
          var promise = self2.ready().then(function() {
            var dbInfo = self2._dbInfo;
            localStorage.removeItem(dbInfo.keyPrefix + key2);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function setItem$2(key2, value, callback) {
          var self2 = this;
          key2 = normalizeKey(key2);
          var promise = self2.ready().then(function() {
            if (value === void 0) {
              value = null;
            }
            var originalValue = value;
            return new Promise$1(function(resolve, reject) {
              var dbInfo = self2._dbInfo;
              dbInfo.serializer.serialize(value, function(value2, error) {
                if (error) {
                  reject(error);
                } else {
                  try {
                    localStorage.setItem(dbInfo.keyPrefix + key2, value2);
                    resolve(originalValue);
                  } catch (e) {
                    if (e.name === "QuotaExceededError" || e.name === "NS_ERROR_DOM_QUOTA_REACHED") {
                      reject(e);
                    }
                    reject(e);
                  }
                }
              });
            });
          });
          executeCallback(promise, callback);
          return promise;
        }
        function dropInstance$2(options, callback) {
          callback = getCallback.apply(this, arguments);
          options = typeof options !== "function" && options || {};
          if (!options.name) {
            var currentConfig = this.config();
            options.name = options.name || currentConfig.name;
            options.storeName = options.storeName || currentConfig.storeName;
          }
          var self2 = this;
          var promise;
          if (!options.name) {
            promise = Promise$1.reject("Invalid arguments");
          } else {
            promise = new Promise$1(function(resolve) {
              if (!options.storeName) {
                resolve(options.name + "/");
              } else {
                resolve(_getKeyPrefix(options, self2._defaultConfig));
              }
            }).then(function(keyPrefix) {
              for (var i = localStorage.length - 1; i >= 0; i--) {
                var key2 = localStorage.key(i);
                if (key2.indexOf(keyPrefix) === 0) {
                  localStorage.removeItem(key2);
                }
              }
            });
          }
          executeCallback(promise, callback);
          return promise;
        }
        var localStorageWrapper = {
          _driver: "localStorageWrapper",
          _initStorage: _initStorage$2,
          _support: isLocalStorageValid(),
          iterate: iterate$2,
          getItem: getItem$2,
          setItem: setItem$2,
          removeItem: removeItem$2,
          clear: clear$2,
          length: length$2,
          key: key$2,
          keys: keys$2,
          dropInstance: dropInstance$2
        };
        var sameValue = function sameValue2(x, y) {
          return x === y || typeof x === "number" && typeof y === "number" && isNaN(x) && isNaN(y);
        };
        var includes = function includes2(array, searchElement) {
          var len = array.length;
          var i = 0;
          while (i < len) {
            if (sameValue(array[i], searchElement)) {
              return true;
            }
            i++;
          }
          return false;
        };
        var isArray = Array.isArray || function(arg) {
          return Object.prototype.toString.call(arg) === "[object Array]";
        };
        var DefinedDrivers = {};
        var DriverSupport = {};
        var DefaultDrivers = {
          INDEXEDDB: asyncStorage,
          WEBSQL: webSQLStorage,
          LOCALSTORAGE: localStorageWrapper
        };
        var DefaultDriverOrder = [DefaultDrivers.INDEXEDDB._driver, DefaultDrivers.WEBSQL._driver, DefaultDrivers.LOCALSTORAGE._driver];
        var OptionalDriverMethods = ["dropInstance"];
        var LibraryMethods = ["clear", "getItem", "iterate", "key", "keys", "length", "removeItem", "setItem"].concat(OptionalDriverMethods);
        var DefaultConfig = {
          description: "",
          driver: DefaultDriverOrder.slice(),
          name: "localforage",
          // Default DB size is _JUST UNDER_ 5MB, as it's the highest size
          // we can use without a prompt.
          size: 4980736,
          storeName: "keyvaluepairs",
          version: 1
        };
        function callWhenReady(localForageInstance, libraryMethod) {
          localForageInstance[libraryMethod] = function() {
            var _args = arguments;
            return localForageInstance.ready().then(function() {
              return localForageInstance[libraryMethod].apply(localForageInstance, _args);
            });
          };
        }
        function extend() {
          for (var i = 1; i < arguments.length; i++) {
            var arg = arguments[i];
            if (arg) {
              for (var _key in arg) {
                if (arg.hasOwnProperty(_key)) {
                  if (isArray(arg[_key])) {
                    arguments[0][_key] = arg[_key].slice();
                  } else {
                    arguments[0][_key] = arg[_key];
                  }
                }
              }
            }
          }
          return arguments[0];
        }
        var LocalForage = function() {
          function LocalForage2(options) {
            _classCallCheck(this, LocalForage2);
            for (var driverTypeKey in DefaultDrivers) {
              if (DefaultDrivers.hasOwnProperty(driverTypeKey)) {
                var driver = DefaultDrivers[driverTypeKey];
                var driverName = driver._driver;
                this[driverTypeKey] = driverName;
                if (!DefinedDrivers[driverName]) {
                  this.defineDriver(driver);
                }
              }
            }
            this._defaultConfig = extend({}, DefaultConfig);
            this._config = extend({}, this._defaultConfig, options);
            this._driverSet = null;
            this._initDriver = null;
            this._ready = false;
            this._dbInfo = null;
            this._wrapLibraryMethodsWithReady();
            this.setDriver(this._config.driver)["catch"](function() {
            });
          }
          LocalForage2.prototype.config = function config(options) {
            if ((typeof options === "undefined" ? "undefined" : _typeof(options)) === "object") {
              if (this._ready) {
                return new Error("Can't call config() after localforage has been used.");
              }
              for (var i in options) {
                if (i === "storeName") {
                  options[i] = options[i].replace(/\W/g, "_");
                }
                if (i === "version" && typeof options[i] !== "number") {
                  return new Error("Database version must be a number.");
                }
                this._config[i] = options[i];
              }
              if ("driver" in options && options.driver) {
                return this.setDriver(this._config.driver);
              }
              return true;
            } else if (typeof options === "string") {
              return this._config[options];
            } else {
              return this._config;
            }
          };
          LocalForage2.prototype.defineDriver = function defineDriver(driverObject, callback, errorCallback) {
            var promise = new Promise$1(function(resolve, reject) {
              try {
                var driverName = driverObject._driver;
                var complianceError = new Error("Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver");
                if (!driverObject._driver) {
                  reject(complianceError);
                  return;
                }
                var driverMethods = LibraryMethods.concat("_initStorage");
                for (var i = 0, len = driverMethods.length; i < len; i++) {
                  var driverMethodName = driverMethods[i];
                  var isRequired = !includes(OptionalDriverMethods, driverMethodName);
                  if ((isRequired || driverObject[driverMethodName]) && typeof driverObject[driverMethodName] !== "function") {
                    reject(complianceError);
                    return;
                  }
                }
                var configureMissingMethods = function configureMissingMethods2() {
                  var methodNotImplementedFactory = function methodNotImplementedFactory2(methodName) {
                    return function() {
                      var error = new Error("Method " + methodName + " is not implemented by the current driver");
                      var promise2 = Promise$1.reject(error);
                      executeCallback(promise2, arguments[arguments.length - 1]);
                      return promise2;
                    };
                  };
                  for (var _i = 0, _len = OptionalDriverMethods.length; _i < _len; _i++) {
                    var optionalDriverMethod = OptionalDriverMethods[_i];
                    if (!driverObject[optionalDriverMethod]) {
                      driverObject[optionalDriverMethod] = methodNotImplementedFactory(optionalDriverMethod);
                    }
                  }
                };
                configureMissingMethods();
                var setDriverSupport = function setDriverSupport2(support) {
                  if (DefinedDrivers[driverName]) {
                    console.info("Redefining LocalForage driver: " + driverName);
                  }
                  DefinedDrivers[driverName] = driverObject;
                  DriverSupport[driverName] = support;
                  resolve();
                };
                if ("_support" in driverObject) {
                  if (driverObject._support && typeof driverObject._support === "function") {
                    driverObject._support().then(setDriverSupport, reject);
                  } else {
                    setDriverSupport(!!driverObject._support);
                  }
                } else {
                  setDriverSupport(true);
                }
              } catch (e) {
                reject(e);
              }
            });
            executeTwoCallbacks(promise, callback, errorCallback);
            return promise;
          };
          LocalForage2.prototype.driver = function driver() {
            return this._driver || null;
          };
          LocalForage2.prototype.getDriver = function getDriver(driverName, callback, errorCallback) {
            var getDriverPromise = DefinedDrivers[driverName] ? Promise$1.resolve(DefinedDrivers[driverName]) : Promise$1.reject(new Error("Driver not found."));
            executeTwoCallbacks(getDriverPromise, callback, errorCallback);
            return getDriverPromise;
          };
          LocalForage2.prototype.getSerializer = function getSerializer(callback) {
            var serializerPromise = Promise$1.resolve(localforageSerializer);
            executeTwoCallbacks(serializerPromise, callback);
            return serializerPromise;
          };
          LocalForage2.prototype.ready = function ready(callback) {
            var self2 = this;
            var promise = self2._driverSet.then(function() {
              if (self2._ready === null) {
                self2._ready = self2._initDriver();
              }
              return self2._ready;
            });
            executeTwoCallbacks(promise, callback, callback);
            return promise;
          };
          LocalForage2.prototype.setDriver = function setDriver(drivers, callback, errorCallback) {
            var self2 = this;
            if (!isArray(drivers)) {
              drivers = [drivers];
            }
            var supportedDrivers = this._getSupportedDrivers(drivers);
            function setDriverToConfig() {
              self2._config.driver = self2.driver();
            }
            function extendSelfWithDriver(driver) {
              self2._extend(driver);
              setDriverToConfig();
              self2._ready = self2._initStorage(self2._config);
              return self2._ready;
            }
            function initDriver(supportedDrivers2) {
              return function() {
                var currentDriverIndex = 0;
                function driverPromiseLoop() {
                  while (currentDriverIndex < supportedDrivers2.length) {
                    var driverName = supportedDrivers2[currentDriverIndex];
                    currentDriverIndex++;
                    self2._dbInfo = null;
                    self2._ready = null;
                    return self2.getDriver(driverName).then(extendSelfWithDriver)["catch"](driverPromiseLoop);
                  }
                  setDriverToConfig();
                  var error = new Error("No available storage method found.");
                  self2._driverSet = Promise$1.reject(error);
                  return self2._driverSet;
                }
                return driverPromiseLoop();
              };
            }
            var oldDriverSetDone = this._driverSet !== null ? this._driverSet["catch"](function() {
              return Promise$1.resolve();
            }) : Promise$1.resolve();
            this._driverSet = oldDriverSetDone.then(function() {
              var driverName = supportedDrivers[0];
              self2._dbInfo = null;
              self2._ready = null;
              return self2.getDriver(driverName).then(function(driver) {
                self2._driver = driver._driver;
                setDriverToConfig();
                self2._wrapLibraryMethodsWithReady();
                self2._initDriver = initDriver(supportedDrivers);
              });
            })["catch"](function() {
              setDriverToConfig();
              var error = new Error("No available storage method found.");
              self2._driverSet = Promise$1.reject(error);
              return self2._driverSet;
            });
            executeTwoCallbacks(this._driverSet, callback, errorCallback);
            return this._driverSet;
          };
          LocalForage2.prototype.supports = function supports(driverName) {
            return !!DriverSupport[driverName];
          };
          LocalForage2.prototype._extend = function _extend(libraryMethodsAndProperties) {
            extend(this, libraryMethodsAndProperties);
          };
          LocalForage2.prototype._getSupportedDrivers = function _getSupportedDrivers(drivers) {
            var supportedDrivers = [];
            for (var i = 0, len = drivers.length; i < len; i++) {
              var driverName = drivers[i];
              if (this.supports(driverName)) {
                supportedDrivers.push(driverName);
              }
            }
            return supportedDrivers;
          };
          LocalForage2.prototype._wrapLibraryMethodsWithReady = function _wrapLibraryMethodsWithReady() {
            for (var i = 0, len = LibraryMethods.length; i < len; i++) {
              callWhenReady(this, LibraryMethods[i]);
            }
          };
          LocalForage2.prototype.createInstance = function createInstance(options) {
            return new LocalForage2(options);
          };
          return LocalForage2;
        }();
        var localforage_js = new LocalForage();
        module3.exports = localforage_js;
      }, { "3": 3 }] }, {}, [4])(4);
    });
  }
});

// node_modules/axios/lib/helpers/bind.js
var require_bind = __commonJS({
  "node_modules/axios/lib/helpers/bind.js"(exports, module) {
    "use strict";
    module.exports = function bind(fn, thisArg) {
      return function wrap() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        return fn.apply(thisArg, args);
      };
    };
  }
});

// node_modules/axios/lib/utils.js
var require_utils = __commonJS({
  "node_modules/axios/lib/utils.js"(exports, module) {
    "use strict";
    var bind = require_bind();
    var toString = Object.prototype.toString;
    function isArray(val) {
      return toString.call(val) === "[object Array]";
    }
    function isUndefined(val) {
      return typeof val === "undefined";
    }
    function isBuffer(val) {
      return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && typeof val.constructor.isBuffer === "function" && val.constructor.isBuffer(val);
    }
    function isArrayBuffer(val) {
      return toString.call(val) === "[object ArrayBuffer]";
    }
    function isFormData(val) {
      return typeof FormData !== "undefined" && val instanceof FormData;
    }
    function isArrayBufferView(val) {
      var result;
      if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
        result = ArrayBuffer.isView(val);
      } else {
        result = val && val.buffer && val.buffer instanceof ArrayBuffer;
      }
      return result;
    }
    function isString(val) {
      return typeof val === "string";
    }
    function isNumber(val) {
      return typeof val === "number";
    }
    function isObject(val) {
      return val !== null && typeof val === "object";
    }
    function isPlainObject(val) {
      if (toString.call(val) !== "[object Object]") {
        return false;
      }
      var prototype = Object.getPrototypeOf(val);
      return prototype === null || prototype === Object.prototype;
    }
    function isDate(val) {
      return toString.call(val) === "[object Date]";
    }
    function isFile(val) {
      return toString.call(val) === "[object File]";
    }
    function isBlob(val) {
      return toString.call(val) === "[object Blob]";
    }
    function isFunction(val) {
      return toString.call(val) === "[object Function]";
    }
    function isStream(val) {
      return isObject(val) && isFunction(val.pipe);
    }
    function isURLSearchParams(val) {
      return typeof URLSearchParams !== "undefined" && val instanceof URLSearchParams;
    }
    function trim(str) {
      return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
    }
    function isStandardBrowserEnv() {
      if (typeof navigator !== "undefined" && (navigator.product === "ReactNative" || navigator.product === "NativeScript" || navigator.product === "NS")) {
        return false;
      }
      return typeof window !== "undefined" && typeof document !== "undefined";
    }
    function forEach(obj, fn) {
      if (obj === null || typeof obj === "undefined") {
        return;
      }
      if (typeof obj !== "object") {
        obj = [obj];
      }
      if (isArray(obj)) {
        for (var i = 0, l = obj.length; i < l; i++) {
          fn.call(null, obj[i], i, obj);
        }
      } else {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fn.call(null, obj[key], key, obj);
          }
        }
      }
    }
    function merge() {
      var result = {};
      function assignValue(val, key) {
        if (isPlainObject(result[key]) && isPlainObject(val)) {
          result[key] = merge(result[key], val);
        } else if (isPlainObject(val)) {
          result[key] = merge({}, val);
        } else if (isArray(val)) {
          result[key] = val.slice();
        } else {
          result[key] = val;
        }
      }
      for (var i = 0, l = arguments.length; i < l; i++) {
        forEach(arguments[i], assignValue);
      }
      return result;
    }
    function extend(a, b, thisArg) {
      forEach(b, function assignValue(val, key) {
        if (thisArg && typeof val === "function") {
          a[key] = bind(val, thisArg);
        } else {
          a[key] = val;
        }
      });
      return a;
    }
    function stripBOM(content) {
      if (content.charCodeAt(0) === 65279) {
        content = content.slice(1);
      }
      return content;
    }
    module.exports = {
      isArray,
      isArrayBuffer,
      isBuffer,
      isFormData,
      isArrayBufferView,
      isString,
      isNumber,
      isObject,
      isPlainObject,
      isUndefined,
      isDate,
      isFile,
      isBlob,
      isFunction,
      isStream,
      isURLSearchParams,
      isStandardBrowserEnv,
      forEach,
      merge,
      extend,
      trim,
      stripBOM
    };
  }
});

// node_modules/axios/lib/helpers/buildURL.js
var require_buildURL = __commonJS({
  "node_modules/axios/lib/helpers/buildURL.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    function encode(val) {
      return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
    }
    module.exports = function buildURL(url, params, paramsSerializer) {
      if (!params) {
        return url;
      }
      var serializedParams;
      if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
      } else if (utils.isURLSearchParams(params)) {
        serializedParams = params.toString();
      } else {
        var parts = [];
        utils.forEach(params, function serialize(val, key) {
          if (val === null || typeof val === "undefined") {
            return;
          }
          if (utils.isArray(val)) {
            key = key + "[]";
          } else {
            val = [val];
          }
          utils.forEach(val, function parseValue(v) {
            if (utils.isDate(v)) {
              v = v.toISOString();
            } else if (utils.isObject(v)) {
              v = JSON.stringify(v);
            }
            parts.push(encode(key) + "=" + encode(v));
          });
        });
        serializedParams = parts.join("&");
      }
      if (serializedParams) {
        var hashmarkIndex = url.indexOf("#");
        if (hashmarkIndex !== -1) {
          url = url.slice(0, hashmarkIndex);
        }
        url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
      }
      return url;
    };
  }
});

// node_modules/axios/lib/core/InterceptorManager.js
var require_InterceptorManager = __commonJS({
  "node_modules/axios/lib/core/InterceptorManager.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    function InterceptorManager() {
      this.handlers = [];
    }
    InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
      this.handlers.push({
        fulfilled,
        rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null
      });
      return this.handlers.length - 1;
    };
    InterceptorManager.prototype.eject = function eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    };
    InterceptorManager.prototype.forEach = function forEach(fn) {
      utils.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    };
    module.exports = InterceptorManager;
  }
});

// node_modules/axios/lib/helpers/normalizeHeaderName.js
var require_normalizeHeaderName = __commonJS({
  "node_modules/axios/lib/helpers/normalizeHeaderName.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    module.exports = function normalizeHeaderName(headers, normalizedName) {
      utils.forEach(headers, function processHeader(value, name) {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
          headers[normalizedName] = value;
          delete headers[name];
        }
      });
    };
  }
});

// node_modules/axios/lib/core/enhanceError.js
var require_enhanceError = __commonJS({
  "node_modules/axios/lib/core/enhanceError.js"(exports, module) {
    "use strict";
    module.exports = function enhanceError(error, config, code, request, response) {
      error.config = config;
      if (code) {
        error.code = code;
      }
      error.request = request;
      error.response = response;
      error.isAxiosError = true;
      error.toJSON = function toJSON() {
        return {
          // Standard
          message: this.message,
          name: this.name,
          // Microsoft
          description: this.description,
          number: this.number,
          // Mozilla
          fileName: this.fileName,
          lineNumber: this.lineNumber,
          columnNumber: this.columnNumber,
          stack: this.stack,
          // Axios
          config: this.config,
          code: this.code,
          status: this.response && this.response.status ? this.response.status : null
        };
      };
      return error;
    };
  }
});

// node_modules/axios/lib/core/createError.js
var require_createError = __commonJS({
  "node_modules/axios/lib/core/createError.js"(exports, module) {
    "use strict";
    var enhanceError = require_enhanceError();
    module.exports = function createError(message, config, code, request, response) {
      var error = new Error(message);
      return enhanceError(error, config, code, request, response);
    };
  }
});

// node_modules/axios/lib/core/settle.js
var require_settle = __commonJS({
  "node_modules/axios/lib/core/settle.js"(exports, module) {
    "use strict";
    var createError = require_createError();
    module.exports = function settle(resolve, reject, response) {
      var validateStatus = response.config.validateStatus;
      if (!response.status || !validateStatus || validateStatus(response.status)) {
        resolve(response);
      } else {
        reject(createError(
          "Request failed with status code " + response.status,
          response.config,
          null,
          response.request,
          response
        ));
      }
    };
  }
});

// node_modules/axios/lib/helpers/cookies.js
var require_cookies = __commonJS({
  "node_modules/axios/lib/helpers/cookies.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    module.exports = utils.isStandardBrowserEnv() ? (
      // Standard browser envs support document.cookie
      /* @__PURE__ */ function standardBrowserEnv() {
        return {
          write: function write(name, value, expires, path, domain, secure) {
            var cookie = [];
            cookie.push(name + "=" + encodeURIComponent(value));
            if (utils.isNumber(expires)) {
              cookie.push("expires=" + new Date(expires).toGMTString());
            }
            if (utils.isString(path)) {
              cookie.push("path=" + path);
            }
            if (utils.isString(domain)) {
              cookie.push("domain=" + domain);
            }
            if (secure === true) {
              cookie.push("secure");
            }
            document.cookie = cookie.join("; ");
          },
          read: function read(name) {
            var match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
            return match ? decodeURIComponent(match[3]) : null;
          },
          remove: function remove(name) {
            this.write(name, "", Date.now() - 864e5);
          }
        };
      }()
    ) : (
      // Non standard browser env (web workers, react-native) lack needed support.
      /* @__PURE__ */ function nonStandardBrowserEnv() {
        return {
          write: function write() {
          },
          read: function read() {
            return null;
          },
          remove: function remove() {
          }
        };
      }()
    );
  }
});

// node_modules/axios/lib/helpers/isAbsoluteURL.js
var require_isAbsoluteURL = __commonJS({
  "node_modules/axios/lib/helpers/isAbsoluteURL.js"(exports, module) {
    "use strict";
    module.exports = function isAbsoluteURL(url) {
      return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
    };
  }
});

// node_modules/axios/lib/helpers/combineURLs.js
var require_combineURLs = __commonJS({
  "node_modules/axios/lib/helpers/combineURLs.js"(exports, module) {
    "use strict";
    module.exports = function combineURLs(baseURL, relativeURL) {
      return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
    };
  }
});

// node_modules/axios/lib/core/buildFullPath.js
var require_buildFullPath = __commonJS({
  "node_modules/axios/lib/core/buildFullPath.js"(exports, module) {
    "use strict";
    var isAbsoluteURL = require_isAbsoluteURL();
    var combineURLs = require_combineURLs();
    module.exports = function buildFullPath(baseURL, requestedURL) {
      if (baseURL && !isAbsoluteURL(requestedURL)) {
        return combineURLs(baseURL, requestedURL);
      }
      return requestedURL;
    };
  }
});

// node_modules/axios/lib/helpers/parseHeaders.js
var require_parseHeaders = __commonJS({
  "node_modules/axios/lib/helpers/parseHeaders.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var ignoreDuplicateOf = [
      "age",
      "authorization",
      "content-length",
      "content-type",
      "etag",
      "expires",
      "from",
      "host",
      "if-modified-since",
      "if-unmodified-since",
      "last-modified",
      "location",
      "max-forwards",
      "proxy-authorization",
      "referer",
      "retry-after",
      "user-agent"
    ];
    module.exports = function parseHeaders(headers) {
      var parsed = {};
      var key;
      var val;
      var i;
      if (!headers) {
        return parsed;
      }
      utils.forEach(headers.split("\n"), function parser(line) {
        i = line.indexOf(":");
        key = utils.trim(line.substr(0, i)).toLowerCase();
        val = utils.trim(line.substr(i + 1));
        if (key) {
          if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
            return;
          }
          if (key === "set-cookie") {
            parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
          } else {
            parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
          }
        }
      });
      return parsed;
    };
  }
});

// node_modules/axios/lib/helpers/isURLSameOrigin.js
var require_isURLSameOrigin = __commonJS({
  "node_modules/axios/lib/helpers/isURLSameOrigin.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    module.exports = utils.isStandardBrowserEnv() ? (
      // Standard browser envs have full support of the APIs needed to test
      // whether the request URL is of the same origin as current location.
      function standardBrowserEnv() {
        var msie = /(msie|trident)/i.test(navigator.userAgent);
        var urlParsingNode = document.createElement("a");
        var originURL;
        function resolveURL(url) {
          var href = url;
          if (msie) {
            urlParsingNode.setAttribute("href", href);
            href = urlParsingNode.href;
          }
          urlParsingNode.setAttribute("href", href);
          return {
            href: urlParsingNode.href,
            protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
            host: urlParsingNode.host,
            search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
            hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
            hostname: urlParsingNode.hostname,
            port: urlParsingNode.port,
            pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
          };
        }
        originURL = resolveURL(window.location.href);
        return function isURLSameOrigin(requestURL) {
          var parsed = utils.isString(requestURL) ? resolveURL(requestURL) : requestURL;
          return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
        };
      }()
    ) : (
      // Non standard browser envs (web workers, react-native) lack needed support.
      /* @__PURE__ */ function nonStandardBrowserEnv() {
        return function isURLSameOrigin() {
          return true;
        };
      }()
    );
  }
});

// node_modules/axios/lib/cancel/Cancel.js
var require_Cancel = __commonJS({
  "node_modules/axios/lib/cancel/Cancel.js"(exports, module) {
    "use strict";
    function Cancel(message) {
      this.message = message;
    }
    Cancel.prototype.toString = function toString() {
      return "Cancel" + (this.message ? ": " + this.message : "");
    };
    Cancel.prototype.__CANCEL__ = true;
    module.exports = Cancel;
  }
});

// node_modules/axios/lib/adapters/xhr.js
var require_xhr = __commonJS({
  "node_modules/axios/lib/adapters/xhr.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var settle = require_settle();
    var cookies = require_cookies();
    var buildURL = require_buildURL();
    var buildFullPath = require_buildFullPath();
    var parseHeaders = require_parseHeaders();
    var isURLSameOrigin = require_isURLSameOrigin();
    var createError = require_createError();
    var defaults = require_defaults();
    var Cancel = require_Cancel();
    module.exports = function xhrAdapter(config) {
      return new Promise(function dispatchXhrRequest(resolve, reject) {
        var requestData = config.data;
        var requestHeaders = config.headers;
        var responseType = config.responseType;
        var onCanceled;
        function done() {
          if (config.cancelToken) {
            config.cancelToken.unsubscribe(onCanceled);
          }
          if (config.signal) {
            config.signal.removeEventListener("abort", onCanceled);
          }
        }
        if (utils.isFormData(requestData)) {
          delete requestHeaders["Content-Type"];
        }
        var request = new XMLHttpRequest();
        if (config.auth) {
          var username = config.auth.username || "";
          var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : "";
          requestHeaders.Authorization = "Basic " + btoa(username + ":" + password);
        }
        var fullPath = buildFullPath(config.baseURL, config.url);
        request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);
        request.timeout = config.timeout;
        function onloadend() {
          if (!request) {
            return;
          }
          var responseHeaders = "getAllResponseHeaders" in request ? parseHeaders(request.getAllResponseHeaders()) : null;
          var responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
          var response = {
            data: responseData,
            status: request.status,
            statusText: request.statusText,
            headers: responseHeaders,
            config,
            request
          };
          settle(function _resolve(value) {
            resolve(value);
            done();
          }, function _reject(err) {
            reject(err);
            done();
          }, response);
          request = null;
        }
        if ("onloadend" in request) {
          request.onloadend = onloadend;
        } else {
          request.onreadystatechange = function handleLoad() {
            if (!request || request.readyState !== 4) {
              return;
            }
            if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
              return;
            }
            setTimeout(onloadend);
          };
        }
        request.onabort = function handleAbort() {
          if (!request) {
            return;
          }
          reject(createError("Request aborted", config, "ECONNABORTED", request));
          request = null;
        };
        request.onerror = function handleError() {
          reject(createError("Network Error", config, null, request));
          request = null;
        };
        request.ontimeout = function handleTimeout() {
          var timeoutErrorMessage = config.timeout ? "timeout of " + config.timeout + "ms exceeded" : "timeout exceeded";
          var transitional = config.transitional || defaults.transitional;
          if (config.timeoutErrorMessage) {
            timeoutErrorMessage = config.timeoutErrorMessage;
          }
          reject(createError(
            timeoutErrorMessage,
            config,
            transitional.clarifyTimeoutError ? "ETIMEDOUT" : "ECONNABORTED",
            request
          ));
          request = null;
        };
        if (utils.isStandardBrowserEnv()) {
          var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ? cookies.read(config.xsrfCookieName) : void 0;
          if (xsrfValue) {
            requestHeaders[config.xsrfHeaderName] = xsrfValue;
          }
        }
        if ("setRequestHeader" in request) {
          utils.forEach(requestHeaders, function setRequestHeader(val, key) {
            if (typeof requestData === "undefined" && key.toLowerCase() === "content-type") {
              delete requestHeaders[key];
            } else {
              request.setRequestHeader(key, val);
            }
          });
        }
        if (!utils.isUndefined(config.withCredentials)) {
          request.withCredentials = !!config.withCredentials;
        }
        if (responseType && responseType !== "json") {
          request.responseType = config.responseType;
        }
        if (typeof config.onDownloadProgress === "function") {
          request.addEventListener("progress", config.onDownloadProgress);
        }
        if (typeof config.onUploadProgress === "function" && request.upload) {
          request.upload.addEventListener("progress", config.onUploadProgress);
        }
        if (config.cancelToken || config.signal) {
          onCanceled = function(cancel) {
            if (!request) {
              return;
            }
            reject(!cancel || cancel && cancel.type ? new Cancel("canceled") : cancel);
            request.abort();
            request = null;
          };
          config.cancelToken && config.cancelToken.subscribe(onCanceled);
          if (config.signal) {
            config.signal.aborted ? onCanceled() : config.signal.addEventListener("abort", onCanceled);
          }
        }
        if (!requestData) {
          requestData = null;
        }
        request.send(requestData);
      });
    };
  }
});

// node_modules/axios/lib/defaults.js
var require_defaults = __commonJS({
  "node_modules/axios/lib/defaults.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var normalizeHeaderName = require_normalizeHeaderName();
    var enhanceError = require_enhanceError();
    var DEFAULT_CONTENT_TYPE = {
      "Content-Type": "application/x-www-form-urlencoded"
    };
    function setContentTypeIfUnset(headers, value) {
      if (!utils.isUndefined(headers) && utils.isUndefined(headers["Content-Type"])) {
        headers["Content-Type"] = value;
      }
    }
    function getDefaultAdapter() {
      var adapter;
      if (typeof XMLHttpRequest !== "undefined") {
        adapter = require_xhr();
      } else if (typeof process !== "undefined" && Object.prototype.toString.call(process) === "[object process]") {
        adapter = require_xhr();
      }
      return adapter;
    }
    function stringifySafely(rawValue, parser, encoder) {
      if (utils.isString(rawValue)) {
        try {
          (parser || JSON.parse)(rawValue);
          return utils.trim(rawValue);
        } catch (e) {
          if (e.name !== "SyntaxError") {
            throw e;
          }
        }
      }
      return (encoder || JSON.stringify)(rawValue);
    }
    var defaults = {
      transitional: {
        silentJSONParsing: true,
        forcedJSONParsing: true,
        clarifyTimeoutError: false
      },
      adapter: getDefaultAdapter(),
      transformRequest: [function transformRequest(data, headers) {
        normalizeHeaderName(headers, "Accept");
        normalizeHeaderName(headers, "Content-Type");
        if (utils.isFormData(data) || utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) {
          return data;
        }
        if (utils.isArrayBufferView(data)) {
          return data.buffer;
        }
        if (utils.isURLSearchParams(data)) {
          setContentTypeIfUnset(headers, "application/x-www-form-urlencoded;charset=utf-8");
          return data.toString();
        }
        if (utils.isObject(data) || headers && headers["Content-Type"] === "application/json") {
          setContentTypeIfUnset(headers, "application/json");
          return stringifySafely(data);
        }
        return data;
      }],
      transformResponse: [function transformResponse(data) {
        var transitional = this.transitional || defaults.transitional;
        var silentJSONParsing = transitional && transitional.silentJSONParsing;
        var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
        var strictJSONParsing = !silentJSONParsing && this.responseType === "json";
        if (strictJSONParsing || forcedJSONParsing && utils.isString(data) && data.length) {
          try {
            return JSON.parse(data);
          } catch (e) {
            if (strictJSONParsing) {
              if (e.name === "SyntaxError") {
                throw enhanceError(e, this, "E_JSON_PARSE");
              }
              throw e;
            }
          }
        }
        return data;
      }],
      /**
       * A timeout in milliseconds to abort a request. If set to 0 (default) a
       * timeout is not created.
       */
      timeout: 0,
      xsrfCookieName: "XSRF-TOKEN",
      xsrfHeaderName: "X-XSRF-TOKEN",
      maxContentLength: -1,
      maxBodyLength: -1,
      validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
      },
      headers: {
        common: {
          "Accept": "application/json, text/plain, */*"
        }
      }
    };
    utils.forEach(["delete", "get", "head"], function forEachMethodNoData(method) {
      defaults.headers[method] = {};
    });
    utils.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
      defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
    });
    module.exports = defaults;
  }
});

// node_modules/axios/lib/core/transformData.js
var require_transformData = __commonJS({
  "node_modules/axios/lib/core/transformData.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var defaults = require_defaults();
    module.exports = function transformData(data, headers, fns) {
      var context = this || defaults;
      utils.forEach(fns, function transform(fn) {
        data = fn.call(context, data, headers);
      });
      return data;
    };
  }
});

// node_modules/axios/lib/cancel/isCancel.js
var require_isCancel = __commonJS({
  "node_modules/axios/lib/cancel/isCancel.js"(exports, module) {
    "use strict";
    module.exports = function isCancel(value) {
      return !!(value && value.__CANCEL__);
    };
  }
});

// node_modules/axios/lib/core/dispatchRequest.js
var require_dispatchRequest = __commonJS({
  "node_modules/axios/lib/core/dispatchRequest.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var transformData = require_transformData();
    var isCancel = require_isCancel();
    var defaults = require_defaults();
    var Cancel = require_Cancel();
    function throwIfCancellationRequested(config) {
      if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
      }
      if (config.signal && config.signal.aborted) {
        throw new Cancel("canceled");
      }
    }
    module.exports = function dispatchRequest(config) {
      throwIfCancellationRequested(config);
      config.headers = config.headers || {};
      config.data = transformData.call(
        config,
        config.data,
        config.headers,
        config.transformRequest
      );
      config.headers = utils.merge(
        config.headers.common || {},
        config.headers[config.method] || {},
        config.headers
      );
      utils.forEach(
        ["delete", "get", "head", "post", "put", "patch", "common"],
        function cleanHeaderConfig(method) {
          delete config.headers[method];
        }
      );
      var adapter = config.adapter || defaults.adapter;
      return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config);
        response.data = transformData.call(
          config,
          response.data,
          response.headers,
          config.transformResponse
        );
        return response;
      }, function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
          throwIfCancellationRequested(config);
          if (reason && reason.response) {
            reason.response.data = transformData.call(
              config,
              reason.response.data,
              reason.response.headers,
              config.transformResponse
            );
          }
        }
        return Promise.reject(reason);
      });
    };
  }
});

// node_modules/axios/lib/core/mergeConfig.js
var require_mergeConfig = __commonJS({
  "node_modules/axios/lib/core/mergeConfig.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    module.exports = function mergeConfig(config1, config2) {
      config2 = config2 || {};
      var config = {};
      function getMergedValue(target, source) {
        if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
          return utils.merge(target, source);
        } else if (utils.isPlainObject(source)) {
          return utils.merge({}, source);
        } else if (utils.isArray(source)) {
          return source.slice();
        }
        return source;
      }
      function mergeDeepProperties(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(config1[prop], config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          return getMergedValue(void 0, config1[prop]);
        }
      }
      function valueFromConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(void 0, config2[prop]);
        }
      }
      function defaultToConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(void 0, config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          return getMergedValue(void 0, config1[prop]);
        }
      }
      function mergeDirectKeys(prop) {
        if (prop in config2) {
          return getMergedValue(config1[prop], config2[prop]);
        } else if (prop in config1) {
          return getMergedValue(void 0, config1[prop]);
        }
      }
      var mergeMap = {
        "url": valueFromConfig2,
        "method": valueFromConfig2,
        "data": valueFromConfig2,
        "baseURL": defaultToConfig2,
        "transformRequest": defaultToConfig2,
        "transformResponse": defaultToConfig2,
        "paramsSerializer": defaultToConfig2,
        "timeout": defaultToConfig2,
        "timeoutMessage": defaultToConfig2,
        "withCredentials": defaultToConfig2,
        "adapter": defaultToConfig2,
        "responseType": defaultToConfig2,
        "xsrfCookieName": defaultToConfig2,
        "xsrfHeaderName": defaultToConfig2,
        "onUploadProgress": defaultToConfig2,
        "onDownloadProgress": defaultToConfig2,
        "decompress": defaultToConfig2,
        "maxContentLength": defaultToConfig2,
        "maxBodyLength": defaultToConfig2,
        "transport": defaultToConfig2,
        "httpAgent": defaultToConfig2,
        "httpsAgent": defaultToConfig2,
        "cancelToken": defaultToConfig2,
        "socketPath": defaultToConfig2,
        "responseEncoding": defaultToConfig2,
        "validateStatus": mergeDirectKeys
      };
      utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
        var merge = mergeMap[prop] || mergeDeepProperties;
        var configValue = merge(prop);
        utils.isUndefined(configValue) && merge !== mergeDirectKeys || (config[prop] = configValue);
      });
      return config;
    };
  }
});

// node_modules/axios/lib/env/data.js
var require_data = __commonJS({
  "node_modules/axios/lib/env/data.js"(exports, module) {
    module.exports = {
      "version": "0.24.0"
    };
  }
});

// node_modules/axios/lib/helpers/validator.js
var require_validator = __commonJS({
  "node_modules/axios/lib/helpers/validator.js"(exports, module) {
    "use strict";
    var VERSION = require_data().version;
    var validators = {};
    ["object", "boolean", "number", "function", "string", "symbol"].forEach(function(type, i) {
      validators[type] = function validator(thing) {
        return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
      };
    });
    var deprecatedWarnings = {};
    validators.transitional = function transitional(validator, version, message) {
      function formatMessage(opt, desc) {
        return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
      }
      return function(value, opt, opts) {
        if (validator === false) {
          throw new Error(formatMessage(opt, " has been removed" + (version ? " in " + version : "")));
        }
        if (version && !deprecatedWarnings[opt]) {
          deprecatedWarnings[opt] = true;
          console.warn(
            formatMessage(
              opt,
              " has been deprecated since v" + version + " and will be removed in the near future"
            )
          );
        }
        return validator ? validator(value, opt, opts) : true;
      };
    };
    function assertOptions(options, schema, allowUnknown) {
      if (typeof options !== "object") {
        throw new TypeError("options must be an object");
      }
      var keys = Object.keys(options);
      var i = keys.length;
      while (i-- > 0) {
        var opt = keys[i];
        var validator = schema[opt];
        if (validator) {
          var value = options[opt];
          var result = value === void 0 || validator(value, opt, options);
          if (result !== true) {
            throw new TypeError("option " + opt + " must be " + result);
          }
          continue;
        }
        if (allowUnknown !== true) {
          throw Error("Unknown option " + opt);
        }
      }
    }
    module.exports = {
      assertOptions,
      validators
    };
  }
});

// node_modules/axios/lib/core/Axios.js
var require_Axios = __commonJS({
  "node_modules/axios/lib/core/Axios.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var buildURL = require_buildURL();
    var InterceptorManager = require_InterceptorManager();
    var dispatchRequest = require_dispatchRequest();
    var mergeConfig = require_mergeConfig();
    var validator = require_validator();
    var validators = validator.validators;
    function Axios(instanceConfig) {
      this.defaults = instanceConfig;
      this.interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager()
      };
    }
    Axios.prototype.request = function request(config) {
      if (typeof config === "string") {
        config = arguments[1] || {};
        config.url = arguments[0];
      } else {
        config = config || {};
      }
      config = mergeConfig(this.defaults, config);
      if (config.method) {
        config.method = config.method.toLowerCase();
      } else if (this.defaults.method) {
        config.method = this.defaults.method.toLowerCase();
      } else {
        config.method = "get";
      }
      var transitional = config.transitional;
      if (transitional !== void 0) {
        validator.assertOptions(transitional, {
          silentJSONParsing: validators.transitional(validators.boolean),
          forcedJSONParsing: validators.transitional(validators.boolean),
          clarifyTimeoutError: validators.transitional(validators.boolean)
        }, false);
      }
      var requestInterceptorChain = [];
      var synchronousRequestInterceptors = true;
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
          return;
        }
        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
      });
      var responseInterceptorChain = [];
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      });
      var promise;
      if (!synchronousRequestInterceptors) {
        var chain = [dispatchRequest, void 0];
        Array.prototype.unshift.apply(chain, requestInterceptorChain);
        chain = chain.concat(responseInterceptorChain);
        promise = Promise.resolve(config);
        while (chain.length) {
          promise = promise.then(chain.shift(), chain.shift());
        }
        return promise;
      }
      var newConfig = config;
      while (requestInterceptorChain.length) {
        var onFulfilled = requestInterceptorChain.shift();
        var onRejected = requestInterceptorChain.shift();
        try {
          newConfig = onFulfilled(newConfig);
        } catch (error) {
          onRejected(error);
          break;
        }
      }
      try {
        promise = dispatchRequest(newConfig);
      } catch (error) {
        return Promise.reject(error);
      }
      while (responseInterceptorChain.length) {
        promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
      }
      return promise;
    };
    Axios.prototype.getUri = function getUri(config) {
      config = mergeConfig(this.defaults, config);
      return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, "");
    };
    utils.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
      Axios.prototype[method] = function(url, config) {
        return this.request(mergeConfig(config || {}, {
          method,
          url,
          data: (config || {}).data
        }));
      };
    });
    utils.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
      Axios.prototype[method] = function(url, data, config) {
        return this.request(mergeConfig(config || {}, {
          method,
          url,
          data
        }));
      };
    });
    module.exports = Axios;
  }
});

// node_modules/axios/lib/cancel/CancelToken.js
var require_CancelToken = __commonJS({
  "node_modules/axios/lib/cancel/CancelToken.js"(exports, module) {
    "use strict";
    var Cancel = require_Cancel();
    function CancelToken(executor) {
      if (typeof executor !== "function") {
        throw new TypeError("executor must be a function.");
      }
      var resolvePromise;
      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });
      var token = this;
      this.promise.then(function(cancel) {
        if (!token._listeners)
          return;
        var i;
        var l = token._listeners.length;
        for (i = 0; i < l; i++) {
          token._listeners[i](cancel);
        }
        token._listeners = null;
      });
      this.promise.then = function(onfulfilled) {
        var _resolve;
        var promise = new Promise(function(resolve) {
          token.subscribe(resolve);
          _resolve = resolve;
        }).then(onfulfilled);
        promise.cancel = function reject() {
          token.unsubscribe(_resolve);
        };
        return promise;
      };
      executor(function cancel(message) {
        if (token.reason) {
          return;
        }
        token.reason = new Cancel(message);
        resolvePromise(token.reason);
      });
    }
    CancelToken.prototype.throwIfRequested = function throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    };
    CancelToken.prototype.subscribe = function subscribe(listener) {
      if (this.reason) {
        listener(this.reason);
        return;
      }
      if (this._listeners) {
        this._listeners.push(listener);
      } else {
        this._listeners = [listener];
      }
    };
    CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
      if (!this._listeners) {
        return;
      }
      var index = this._listeners.indexOf(listener);
      if (index !== -1) {
        this._listeners.splice(index, 1);
      }
    };
    CancelToken.source = function source() {
      var cancel;
      var token = new CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token,
        cancel
      };
    };
    module.exports = CancelToken;
  }
});

// node_modules/axios/lib/helpers/spread.js
var require_spread = __commonJS({
  "node_modules/axios/lib/helpers/spread.js"(exports, module) {
    "use strict";
    module.exports = function spread(callback) {
      return function wrap(arr) {
        return callback.apply(null, arr);
      };
    };
  }
});

// node_modules/axios/lib/helpers/isAxiosError.js
var require_isAxiosError = __commonJS({
  "node_modules/axios/lib/helpers/isAxiosError.js"(exports, module) {
    "use strict";
    module.exports = function isAxiosError(payload) {
      return typeof payload === "object" && payload.isAxiosError === true;
    };
  }
});

// node_modules/axios/lib/axios.js
var require_axios = __commonJS({
  "node_modules/axios/lib/axios.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var bind = require_bind();
    var Axios = require_Axios();
    var mergeConfig = require_mergeConfig();
    var defaults = require_defaults();
    function createInstance(defaultConfig) {
      var context = new Axios(defaultConfig);
      var instance = bind(Axios.prototype.request, context);
      utils.extend(instance, Axios.prototype, context);
      utils.extend(instance, context);
      instance.create = function create(instanceConfig) {
        return createInstance(mergeConfig(defaultConfig, instanceConfig));
      };
      return instance;
    }
    var axios2 = createInstance(defaults);
    axios2.Axios = Axios;
    axios2.Cancel = require_Cancel();
    axios2.CancelToken = require_CancelToken();
    axios2.isCancel = require_isCancel();
    axios2.VERSION = require_data().version;
    axios2.all = function all(promises) {
      return Promise.all(promises);
    };
    axios2.spread = require_spread();
    axios2.isAxiosError = require_isAxiosError();
    module.exports = axios2;
    module.exports.default = axios2;
  }
});

// node_modules/axios/index.js
var require_axios2 = __commonJS({
  "node_modules/axios/index.js"(exports, module) {
    module.exports = require_axios();
  }
});

// node_modules/pokeapi-js-wrapper/src/index.js
var import_localforage2 = __toESM(require_localforage());

// node_modules/pokeapi-js-wrapper/src/endpoints.json
var endpoints_default = [
  ["getBerry", "name", "berry/:id/"],
  ["getBerryFirmness", "name", "berry-firmness/:id/"],
  ["getBerryFlavor", "name", "berry-flavor/:id/"],
  ["getContestType", "name", "contest-type/:id/"],
  ["getContestEffect", "id", "contest-effect/:id/"],
  ["getSuperContestEffect", "id", "super-contest-effect/:id/"],
  ["getEncounterMethod", "name", "encounter-method/:id/"],
  ["getEncounterCondition", "name", "encounter-condition/:id/"],
  ["getEncounterConditionValue", "name", "encounter-condition-value/:id/"],
  ["getEvolutionChain", "id", "evolution-chain/:id/"],
  ["getEvolutionTrigger", "name", "evolution-trigger/:id/"],
  ["getGeneration", "name", "generation/:id/"],
  ["getPokedex", "name", "pokedex/:id/"],
  ["getVersion", "name", "version/:id/"],
  ["getVersionGroup", "name", "version-group/:id/"],
  ["getItem", "name", "item/:id/"],
  ["getItemAttribute", "name", "item-attribute/:id/"],
  ["getItemCategory", "name", "item-category/:id/"],
  ["getItemFlingEffect", "name", "item-fling-effect/:id/"],
  ["getItemPocket", "name", "item-pocket/:id/"],
  ["getMachine", "id", "machine/:id/"],
  ["getMove", "name", "move/:id/"],
  ["getMoveAilment", "name", "move-ailment/:id/"],
  ["getMoveBattleStyle", "name", "move-battle-style/:id/"],
  ["getMoveCategory", "name", "move-category/:id/"],
  ["getMoveDamageClass", "name", "move-damage-class/:id/"],
  ["getMoveLearnMethod", "name", "move-learn-method/:id/"],
  ["getMoveTarget", "name", "move-target/:id/"],
  ["getLocation", "name", "location/:id/"],
  ["getLocationArea", "name", "location-area/:id/"],
  ["getPalParkArea", "name", "pal-park-area/:id/"],
  ["getRegion", "name", "region/:id/"],
  ["getAbility", "name", "ability/:id/"],
  ["getCharacteristic", "id", "characteristic/:id/"],
  ["getEggGroup", "name", "egg-group/:id/"],
  ["getGender", "name", "gender/:id/"],
  ["getGrowthRate", "name", "growth-rate/:id/"],
  ["getNature", "name", "nature/:id/"],
  ["getPokeathlonStat", "name", "pokeathlon-stat/:id/"],
  ["getPokemon", "name", "pokemon/:id/"],
  ["getPokemonEncounterAreas", "name", "pokemon/:id/encounters/"],
  ["getPokemonColor", "name", "pokemon-color/:id/"],
  ["getPokemonForm", "name", "pokemon-form/:id/"],
  ["getPokemonHabitat", "name", "pokemon-habitat/:id/"],
  ["getPokemonShape", "name", "pokemon-shape/:id/"],
  ["getPokemonSpecies", "name", "pokemon-species/:id/"],
  ["getStat", "name", "stat/:id/"],
  ["getType", "name", "type/:id/"],
  ["getLanguage", "name", "language/:id/"]
];

// node_modules/pokeapi-js-wrapper/src/rootEndpoints.json
var rootEndpoints_default = [
  ["getEndpoints", ""],
  ["getBerries", "berry/"],
  ["getBerriesFirmnesss", "berry-firmness/"],
  ["getBerriesFlavors", "berry-flavor/"],
  ["getContestTypes", "contest-type/"],
  ["getContestEffects", "contest-effect/"],
  ["getSuperContestEffects", "super-contest-effect/"],
  ["getEncounterMethods", "encounter-method/"],
  ["getEncounterConditions", "encounter-condition/"],
  ["getEncounterConditionValues", "encounter-condition-value/"],
  ["getEvolutionChains", "evolution-chain/"],
  ["getEvolutionTriggers", "evolution-trigger/"],
  ["getGenerations", "generation/"],
  ["getPokedexs", "pokedex/"],
  ["getVersions", "version/"],
  ["getVersionGroups", "version-group/"],
  ["getItems", "item/"],
  ["getItemAttributes", "item-attribute/"],
  ["getItemCategories", "item-category/"],
  ["getItemFlingEffects", "item-fling-effect/"],
  ["getItemPockets", "item-pocket/"],
  ["getMachines", "machine/"],
  ["getMoves", "move/"],
  ["getMoveAilments", "move-ailment/"],
  ["getMoveBattleStyles", "move-battle-style/"],
  ["getMoveCategories", "move-category/"],
  ["getMoveDamageClasses", "move-damage-class/"],
  ["getMoveLearnMethods", "move-learn-method/"],
  ["getMoveTargets", "move-target/"],
  ["getLocations", "location/"],
  ["getLocationAreas", "location-area/"],
  ["getPalParkAreas", "pal-park-area/"],
  ["getRegions", "region/"],
  ["getAbilities", "ability/"],
  ["getCharacteristics", "characteristic/"],
  ["getEggGroups", "egg-group/"],
  ["getGenders", "gender/"],
  ["getGrowthRates", "growth-rate/"],
  ["getNatures", "nature/"],
  ["getPokeathlonStats", "pokeathlon-stat/"],
  ["getPokemons", "pokemon/"],
  ["getPokemonColors", "pokemon-color/"],
  ["getPokemonForms", "pokemon-form/"],
  ["getPokemonHabitats", "pokemon-habitat/"],
  ["getPokemonShapes", "pokemon-shape/"],
  ["getPokemonSpecies", "pokemon-species/"],
  ["getStats", "stat/"],
  ["getTypes", "type/"],
  ["getLanguages", "language/"]
];

// node_modules/pokeapi-js-wrapper/src/getter.js
var import_axios = __toESM(require_axios2());
var import_localforage = __toESM(require_localforage());
var CACHE_PREFIX = "pokeapi-js-wrapper-";
function loadResource(config, url) {
  return new Promise((resolve, reject) => {
    import_localforage.default.ready().then(() => {
      import_localforage.default.getItem(`${CACHE_PREFIX}${url}`).then((value) => {
        if (value === null) {
          loadUrl(config, url).then((res) => {
            resolve(res);
          }).catch((err) => {
            reject(err);
          });
        } else {
          resolve(addCacheMark(value));
        }
      }).catch((err) => {
        loadUrl(config, url).then((res) => {
          resolve(res);
        }).catch((err2) => {
          reject(err2);
        });
      });
    }).catch((err) => {
      loadUrl(config, url).then((res) => {
        resolve(res);
      }).catch((err2) => {
        reject(err2);
      });
    });
  });
}
function loadUrl(config, url) {
  return new Promise((resolve, reject) => {
    let options = {
      baseURL: `${config.protocol}://${config.hostName}/`,
      timeout: config.timeout
    };
    import_axios.default.get(url, options).then((response) => {
      if (response.status >= 400) {
        reject(response);
      } else {
        if (config.cache) {
          import_localforage.default.setItem(`${CACHE_PREFIX}${url}`, response.data);
        }
        resolve(response.data);
      }
    }).catch((err) => {
      reject(err);
    });
  });
}

// node_modules/pokeapi-js-wrapper/src/installSW.js
function installSW() {
  if (navigator && window && "serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker.register("./pokeapi-js-wrapper-sw.js", { scope: "./" }).catch((error) => {
        console.log("Pokeapi-js-wrapper SW installation failed with the following error:");
        console.error(error);
      });
    });
  }
}

// node_modules/pokeapi-js-wrapper/src/config.js
var Config = class {
  constructor(config = {}) {
    this.protocol = "https";
    this.hostName = "pokeapi.co";
    this.versionPath = "/api/v2/";
    this.offset = 0;
    this.limit = 1e5;
    this.timeout = 10 * 1e3;
    this.cache = true;
    this.cacheImages = false;
    if (config.hasOwnProperty("protocol")) {
      this.protocol = config.protocol;
    }
    if (config.hasOwnProperty("hostName")) {
      this.hostName = config.hostName;
    }
    if (config.hasOwnProperty("versionPath")) {
      this.versionPath = config.versionPath;
    }
    if (config.hasOwnProperty("offset")) {
      this.offset = config.offset - 1;
    }
    if (config.hasOwnProperty("limit")) {
      this.limit = config.limit;
    }
    if (config.hasOwnProperty("timeout")) {
      this.timeout = config.timeout;
    }
    if (config.hasOwnProperty("cache")) {
      this.cache = config.cache;
    }
    if (config.hasOwnProperty("cacheImages")) {
      this.cacheImages = config.cacheImages;
    }
  }
};

// node_modules/pokeapi-js-wrapper/src/index.js
import_localforage2.default.config({
  name: "pokeapi-js-wrapper"
});
var Pokedex = class {
  constructor(config) {
    this.config = new Config(config);
    endpoints_default.forEach((endpoint) => {
      const endpointFullName = buildEndpointFullName(endpoint);
      this[endpointFullName] = (input) => {
        if (input) {
          if (typeof input === "number" || typeof input === "string") {
            return loadResource(this.config, `${this.config.versionPath}${endpoint[2].replace(":id", input)}`);
          } else if (typeof input === "object") {
            return Promise.all(mapResources(this.config, endpoint, input));
          }
        }
      };
      this[buildEndpointName(endpoint)] = this[endpointFullName];
    });
    rootEndpoints_default.forEach((rootEndpoint) => {
      const rootEndpointFullName = buildRootEndpointFullName(rootEndpoint);
      this[rootEndpointFullName] = (config2) => {
        var limit = this.config.limit;
        var offset = this.config.offset;
        if (config2) {
          if (config2.hasOwnProperty("offset")) {
            offset = config2.offset;
          }
          if (config2.hasOwnProperty("limit")) {
            limit = config2.limit;
          }
        }
        return loadResource(this.config, `${this.config.versionPath}${rootEndpoint[1]}?limit=${limit}&offset=${offset}`);
      };
      this[rootEndpoint[0]] = this[rootEndpointFullName];
    });
    if (this.config.cacheImages) {
      installSW();
    }
  }
  getConfig() {
    return this.config;
  }
  getCacheLength() {
    return import_localforage2.default.length();
  }
  clearCache() {
    return import_localforage2.default.clear();
  }
  resource(path) {
    if (typeof path === "string") {
      return loadResource(this.config, path);
    } else if (Array.isArray(path)) {
      return Promise.all(path.map((p) => loadResource(this.config, p)));
    } else {
      return "String or Array is required";
    }
  }
};
function mapResources(config, endpoint, inputs) {
  return inputs.map((input) => {
    return loadResource(config, `${config.versionPath}${endpoint[2].replace(":id", input)}`);
  });
}
function buildEndpointFullName(endpoint) {
  return `${endpoint[0]}By${capitalize(endpoint[1])}`;
}
function buildEndpointName(endpoint) {
  return `${endpoint[0]}`;
}
function buildRootEndpointFullName(endpoint) {
  return `${endpoint[0]}List`;
}
function capitalize([first, ...rest]) {
  return first.toUpperCase() + rest.join("").toLowerCase();
}
export {
  Pokedex
};
/*! Bundled license information:

localforage/dist/localforage.js:
  (*!
      localForage -- Offline Storage, Improved
      Version 1.10.0
      https://localforage.github.io/localForage
      (c) 2013-2017 Mozilla, Apache License 2.0
  *)
*/
//# sourceMappingURL=pokeapi-js-wrapper.js.map
