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
