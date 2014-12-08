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
