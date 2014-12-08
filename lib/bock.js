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
