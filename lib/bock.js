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
