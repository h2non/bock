var store = []

self.addEventListener('message', function (event) {
  var data = event.data
  if (data) {
    switch (data.topic) {
      case 'bock.add': addRequest(data)
        break
      case 'bock.clean': cleanRequest()
        break
      case 'block.flush': flushData()
        break
    }
  }
})

self.addEventListener('activate', function (event) {
  console.log('Activate:', event)
  event.waitUntil(Promise.resolve())
})

self.addEventListener('fetch', function (event) {
  //postMessage({ topic: 'request.fetch', data: event.request })
  var match = matchRequest(event.request)
  if (match) {
    event.respondWith(buildResponse(match.config))
  }
})

function buildResponse(config) {
  if (config.proxy) {
    return fetch(config.url, {
      method: config.method,
      body: config.proxyBody,
      headers: config.proxyHeaders
    })
  } else {
    return new Response(config.responseBody || '', { status: config.responseCode, headers: config.headers })
  }
}

function matchRequest(request) {
  return store.filter(matchURL(request)).filter(matchHeaders(request)).shift()
}

function matchURL(request) {
  // to do: support regex
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

function matchParams() {

}

function matchBody() {

}

function matchHeaders(request) {
  return function (mock) {
    var headers = mock.headers
    var requestHeaders = request.headers
    if (headers) {
      for (var prop in headers) {
        if (requestHeaders.has(prop) && !requestHeaders.get(prop).match(new RegExp(headers[prop], 'i'))) {
          return false
        }
      }
    }
    return true
  }
}

function addRequest(data) {
  store.push({ id: data.id, config: data.config })
}
