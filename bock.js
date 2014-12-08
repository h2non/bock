!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.bock=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var _ = require('./utils')

module.exports = Bock

function Bock(service, url, options) {
  this.id = _.uuid()
  this.matched = false
  this.service = service
  this.config = _.merge({
    url: normalizeURL(url) || location.href,
    method: 'GET',
    times: 1
  }, options)
}

Bock.prototype.get = function (path) {
  this.config.method = 'GET'
  this.config.url += path
  return this
}

Bock.prototype.post = function (path, body) {
  this.config.method = 'POST'
  this.config.url += path
  return this
}

Bock.prototype.put = function (path, body) {
  this.config.method = 'PUT'
  this.config.url += path
  return this
}

Bock.prototype.delete = function (path, body) {
  this.config.method = 'DELETE'
  this.config.url += path
  return this
}

Bock.prototype.patch = function (path, body) {
  this.config.method = 'PATCH'
  this.config.url += path
  return this
}

Bock.prototype.head = function (path, body) {
  this.config.method = 'HEAD'
  this.config.url += path
  return this
}

Bock.prototype.headers = function (headers) {
  this.config.params = headers
  return this
}

Bock.prototype.params = function (params) {
  this.config.params = params
  return this
}

Bock.prototype.auth = function (username, password) {
  this.config.username = username
  this.config.password = password
  return this
}

Bock.prototype.times = function (times) {
  this.config.times = times
  return this
}

Bock.prototype.persist = function () {
  this.config.persist = true
  return this
}

Bock.prototype.body =
Bock.prototype.withBody = function (body) {
  this.config.body = body
}

Bock.prototype.replyHeaders =
Bock.prototype.respondHeaders =
Bock.prototype.respondWithHeaders = function (headers) {
  this.config.responseHeaders = headers
  return this
}

Bock.prototype.replyBody =
Bock.prototype.respondBody =
Bock.prototype.respondWithBody = function (body) {
  this.config.responseBody = body
  return this
}

Bock.prototype.reply =
Bock.prototype.respond =
Bock.prototype.respondWith = function (code, body, headers) {
  this.config.responseCode = code == null ? 200 : code
  if (body) {
    this.config.responseBody = body
  }
  if (headers) {
    this.config.responseHeaders = headers
  }
  this.expect()
  return this
}

Bock.prototype.proxy =
Bock.prototype.proxyTo = function (url, body, headers) {
  this.config.proxy = url
  if (body) {
    this.config.proxyBody = body
  }
  if (headers) {
    this.config.proxyHeaders = headers
  }
  this.expect()
  return this
}

Bock.prototype.proxyHeaders = function (headers) {
  this.config.proxyHeaders = headers
  return this
}

Bock.prototype.proxyBody = function (body) {
  this.config.proxyBody = body
  return this
}

Bock.prototype.matches = function () {
  return this.matched
}

Bock.prototype.expect = function () {
  this.service.add(this.id, this.config).then(function (success) {
    console.log('Success', success)
  }, function (err) {
    console.log('Error:', err)
  })
  return this
}

function normalizeURL(url) {
  return url.replace(/\/\/+/g, '/')
}

},{"./utils":4}],2:[function(require,module,exports){
var _ = require('./utils')
var Bock = require('./bock')
var service = require('./service')
var hasServiceWorker = 'serviceWorker' in navigator

module.exports = bock

function bock(url, options) {
  var service = resolveServiceWorker(options)
  return new Bock(service, url, options)
}

function resolveServiceWorker(options) {
  if (!hasServiceWorker) {
    throw new Error('Service Worker is not supported in the current browser')
  }
  return service(_.merge({ path: bock.workerPath }, options))
}

bock.VERSION = '0.1.0'
bock.workerPath = '/bock.worker.js'
bock.Bock = Bock

},{"./bock":1,"./service":3,"./utils":4}],3:[function(require,module,exports){
var serviceWorker = navigator.serviceWorker
var serviceInstance = null
var serviceWorkerInstance = null

module.exports = function (options) {
  if (!serviceInstance) {
    serviceInstance = new Service(options)
  }
  return serviceInstance
}

function Service(options) {
  this.service = getServiceWorker(options)
}

Service.prototype.add = function (id, config) {
  return new Promise(function (resolve, reject) {
    this.service().then(function (registration) {
      serviceWorkerInstance = registration
      // to do: isolate
      if (registration.installing) {
        registration.installing.postMessage({ topic: 'bock.add', id: id, config: config })
      } else {
        registration.active.postMessage({ topic: 'bock.add', id: id, config: config })
      }
    }).catch(reject)
  }.bind(this))
}

Service.prototype.close = function () {
  var promise = Promise.resolve(null)
  if (serviceWorkerInstance) {
    promise = serviceWorkerInstance.unregister()
  }
  return promise
}

function getServiceWorker(options) {
  return function () {
    if (serviceWorkerInstance) {
      return Promise.resolve(serviceWorkerInstance)
    } else {
      return serviceWorker.register(options.path, { scope: getScriptScope(options) })
    }
  }
}

function getScriptScope(options) {
  var path = options.path
  if (!(/^http[s]?\/\//i.test(path))) {
    path = location.origin + path
  }
  return new URL(path).pathname.split('/').slice(0, -1).join('/') + '/'
}

},{}],4:[function(require,module,exports){
exports.merge = function (target, origin) {
  for (var prop in origin) {
    target[prop] = origin[prop]
  }
  return target
}

exports.uuid = function () {
  var uuid = '', i, random
  for (i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) uuid += '-'
    uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16)
  }
  return uuid
}

},{}]},{},[2])(2)
});