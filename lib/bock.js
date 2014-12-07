module.exports = Bock

function Bock(url) {
  this.config = {
    url: url || location.href,
    method: 'GET'
  }
}

Bock.prototype.get = function (path) {
  this.config.method = 'GET'
  this.config.url +=
}

Bock.prototype.post = function (path, body) {
  this.config.method = 'POST'
}

Bock.prototype.put = function (path, body) {
  this.config.method = 'PUT'
}

Bock.prototype.delete = function (path, body) {
  this.config.method = 'DELETE'
}

Bock.prototype.patch = function (path, body) {
  this.config.method = 'PATCH'
}

Bock.prototype.head = function (path, body) {
  this.config.method = 'HEAD'
}

Bock.prototype.headers = function (headers) {
  this.config.params = headers
}

Bock.prototype.params = function (params) {
  this.config.params = params
}

Bock.prototype.replyHeaders =
Bock.prototype.respondHeaders =
Bock.prototype.respondWithHeaders = function (headers) {
  this.config.responseHeaders = headers
}

Bock.prototype.replyBody =
Bock.prototype.respondBody =
Bock.prototype.respondWithBody = function (body) {
  this.config.responseBody = body
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
}
