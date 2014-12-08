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

Service.prototype.add = function (id, config) {
  return sendWorkerMessage.call(this, { topic: 'bock.add', id: id, config: config })
}

Service.prototype.remove = function (id, config) {
  return sendWorkerMessage.call(this, { topic: 'bock.remove', id: id, config: config })
}

Service.prototype.remove = function (id) {
  return sendWorkerMessage.call(this, { topic: 'bock.remove', id: id })
}

Service.prototype.flush = function (id) {
  return sendWorkerMessage.call(this, { topic: 'bock.flush' })
}

Service.prototype.close = function () {
  var promise = Promise.resolve(null)
  if (serviceWorkerInstance) {
    promise = serviceWorkerInstance.unregister()
  }
  return promise
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
