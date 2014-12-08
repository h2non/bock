'use strict'

var store = []

function removeById(id) {
  for (var i = 0, l = store.length; i < l; i += 1) {
    if (store[i].id === id) {
      store.splice(i, 1)
      break
    }
  }
}

self.addEventListener('message', function (event) {
  var data = event.data
  if (data) {
    switch (data.topic) {
      case 'bock.append':
        store.push({ id: data.id, config: data.config })
        break
      case 'bock.remove':
        removeById(data.id)
        break
      case 'bock.sync':
        store = data.config
        break
      case 'bock.flush':
        store = []
        break
    }
  }
})

self.addEventListener('fetch', function (event) {
  var match = matchRequest(event.request)
  if (match) {
    event.respondWith(injectResponse(match.config))
  }
})

function injectResponse(config) {
  if (config.proxy) {
    return proxyRequest(config)
  } else {
    return buildMockResponse(config)
  }
}

function buildMockResponse(config) {
  return new Response(config.responseBody || '', {
    status: config.responseCode,
    headers: config.headers
  })
}

function proxyRequest(config) {
  return fetch(config.proxy, {
    method: config.proxyMethod || config.method,
    body: config.proxyBody || config.body,
    headers: config.headers || config.proxyHeaders,
    credentials: config.credentials
  })
}

function matchRequest(request) {
  return store
    .filter(matchURL(request))
    .filter(matchHeaders(request))
    .shift()
}

function matchURL(request) {
  var requestUrl = new URL(request.url)
  return function (mock) {
    var mockUrl = new URL(mock.config.url)
    return mock.config.method === request.method
      && mockUrl.origin === requestUrl.origin
      && mockUrl.password === requestUrl.password
      && mockUrl.username === requestUrl.username
      && mockUrl.pathname === requestUrl.pathname
  }
}

function matchHeaders(request) {
  return function (mock) {
    var headers = mock.headers
    var requestHeaders = request.headers
    if (headers) for (var prop in headers) {
      if (matchHeader(requestHeaders, headers, prop)) return false
    }
    return true
  }
}

function matchHeader(requestHeaders, headers, prop) {
  return requestHeaders.has(prop)
    && !requestHeaders.get(prop).match(new RegExp(headers[prop], 'i'))
}
