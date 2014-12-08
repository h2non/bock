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
