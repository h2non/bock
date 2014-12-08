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
