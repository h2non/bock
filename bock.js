!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.bock=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var _ = require('./utils')
var store = require('./store')
var Proxy = require('./proxy')

module.exports = Bock

function Bock(service, url, options) {
  this.id = _.uuid()
  this.service = service
  this.config = _.merge({}, Bock.defaults, { url: normalizeURL(url) }, options)
}

Bock.defaults = {
  url: location.href,
  method: 'GET',
  headers: null,
  crendetials: 'omit',
  persist: true
}

Bock.prototype = Object.create(Proxy.prototype)

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
  this.config.headers = headers
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
  this.config.persist = false
  return this
}

Bock.prototype.body = function (body) {
  this.config.body = body
  return this
}

Bock.prototype.replyHeaders =
Bock.prototype.replyWithHeaders = function (headers) {
  this.config.responseHeaders = headers
  return this
}

Bock.prototype.replyBody =
Bock.prototype.replyWithBody = function (body) {
  this.config.responseBody = body
  return this
}

Bock.prototype.reply =
Bock.prototype.replyWith = function (code, body, headers) {
  this.config.responseCode = code == null ? 200 : code
  if (body) {
    this.config.responseBody = body
  }
  if (headers) {
    this.config.responseHeaders = headers
  }
  return this.forward()
}

Bock.prototype.delay = function (ms) {
  this.config.delay = ms
  return this
}

Bock.prototype.forward = function () {
  store.append(this)
  return this.service.append(this.id, this.config).catch(onFailure)
}

function normalizeURL(url) {
  return url.replace(/\/\/+(\s+)?$/g, '/')
}

function onFailure(ex) {
  throw ex // by the moment, fail making noise
}

},{"./proxy":3,"./store":5,"./utils":6}],2:[function(require,module,exports){
var Bock = require('./bock')
var store = require('./store')
var service = require('./service')
var merge = require('./utils').merge
var hasServiceWorker = 'serviceWorker' in navigator

module.exports = bock

function bock(url, options) {
  var service = resolveServiceWorker(options)
  return new Bock(service, url, options)
}

bock.VERSION = '0.1.0-beta.0'
bock.workerPath = '/bock.worker.js'

bock.isControllable = bock.isEnabled = function () {
  return navigator.serviceWorker.controller != null
}

bock.stop = function () {
  return service().unregister()
}

bock.cleanAll = function () {
  store.flush()
  return service().flush()
}

bock.entries = function () {
  return store.all()
}

function resolveServiceWorker(options) {
  if (!hasServiceWorker) {
    throw new Error('ServiceWorker is not supported in the current browser')
  }
  return service(merge({ path: bock.workerPath }, options))
}

},{"./bock":1,"./service":4,"./store":5,"./utils":6}],3:[function(require,module,exports){
module.exports = Proxy

function Proxy() {}

Proxy.prototype.withMethod = function (method) {
  this.config.proxyMethod = method.toUpperCase()
  return this
}

Proxy.prototype.withHeaders = function (headers) {
  this.config.proxyHeaders = headers
  return this
}

Proxy.prototype.withBody = function (body) {
  this.config.proxyBody = body
  return this
}

Proxy.prototype.credentials = function (type) {
  this.config.credentials = type
  return this
}

Proxy.prototype.proxy =
Proxy.prototype.proxyTo = function (url, body, headers) {
  this.config.proxy = url
  if (body) {
    this.config.proxyBody = body
  }
  if (headers) {
    this.config.proxyHeaders = headers
  }
  return this
}

},{}],4:[function(require,module,exports){
var serviceWorker = navigator.serviceWorker
var serviceInstance = null
var serviceWorkerInstance = null

module.exports = serviceFactory

function serviceFactory(options) {
  if (!serviceInstance) {
    serviceInstance = new Service(options)
  }
  return serviceInstance
}

function Service(options) {
  this.service = getServiceWorker(options)
}

Service.prototype.append = function (id, config) {
  return sendWorkerMessage.call(this, { topic: 'bock.append', id: id, config: config })
}

Service.prototype.remove = function (id) {
  return sendWorkerMessage.call(this, { topic: 'bock.remove', id: id })
}

Service.prototype.flush = function (id) {
  return sendWorkerMessage.call(this, { topic: 'bock.flush' })
}

Service.prototype.unregister = function () {
  if (serviceWorkerInstance) {
    return serviceWorkerInstance.unregister()
  } else {
    return Promise.resolve(null)
  }
}

function sendWorkerMessage(data) {
  return new Promise(function (resolve, reject) {
    this.service().then(function (registration) {
      var client = getServiceWorkerClient(registration)
      client.postMessage(data)
      resolve(client)
    }).catch(reject)
  }.bind(this))
}

function getServiceWorkerClient(registration) {
  serviceWorkerInstance = registration
  if (registration.installing) {
    return registration.installing
  } else {
    return registration.active
  }
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

},{}],5:[function(require,module,exports){
var buf = []
var store = exports

store.append = function (data) {
  buf.push(data)
}

store.remove = function (id) {
  var item = store.get(id)
  if (item) buf.splice(buf.indexOf(item), 1)
}

store.get = function (id) {
  var i, l, isString = typeof id === 'string'
  for (i = 0, l = buf.length; i < l; i += 1) {
    if ((isString && buf[i].id === id) || buf[i] === id) {
      return buf[i]
    }
  }
  return null
}

store.all = function () {
  return buf.map(function (mock) {
    return { id: mock.id, config: mock.config }
  })
}

store.flush = function () {
  buf.splice(0)
}

},{}],6:[function(require,module,exports){
exports.merge = function (target, origins) {
  var origins = Array.prototype.slice.call(arguments).slice(1)
  origins.forEach(function (origin) {
    for (var prop in origin) {
      target[prop] = origin[prop]
    }
  })
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