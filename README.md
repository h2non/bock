# bock [![Build Status](https://api.travis-ci.org/h2non/bock.svg?branch=master)][travis] [![Code Climate](https://codeclimate.com/github/h2non/bock/badges/gpa.svg)](https://codeclimate.com/github/h2non/bock) [![Version](https://img.shields.io/bower/v/bock.svg)](https://github.com/h2non/bock/releases) [![Stories in Ready](https://badge.waffle.io/h2non/bock.png?label=ready&title=Ready)](https://waffle.io/h2non/bock)

Browser **next-generation HTTP traffic mocking**, **proxy**, **interceptor** and request **transformer** using [Service Worker][spec]
and providing an **elegant** and **simple programmatic approach**

**Note** that **ServiceWorker is still an experimental technology** and which its standard is [under active discussion][discussion] and is [not currently supported][browser-support] by latest production browsers

You should consider this library is very much a work in progress, as I enjoy with it as an experimental hacking-driven implementation, therefore important changes can be done in a near future and API retrocompatibility is not premise

If you are new with ServiceWorker, before getting started you could take a look to the [explainer][explainer] document, [HTML5rocks introduction][html5rocks] or the [draft specification][spec]

## Installation

Via [Bower](http://bower.io)
```bash
bower install bock
```

Via [Component](https://github.com/component/component)
```bash
component install h2non/bock
```

Or loading the script remotely
```html
<script src="//cdn.rawgit.com/h2non/bock/0.1.0-beta.0/bock.js"></script>
```

### Setup

Due to ServiceWorkers [security limitations][serviceWorkerGettingStarted], it's required to copy the `bock.worker.js` source in the root directory of your application (although, you could use the HTTP server rewrite rules to do the same in remote servers) in order to be enable the Service Worker control into the desired page scope (defaults to `/`)

Example command if you are using Bower as package manager
```bash
cp ./bower_components/bock/bock.worker.js .
```

### Chrome Canary setup

To start hacking with ServiceWorker you should enable the "experimental Web Platform features" flag in Canary.
You can do it opening [chrome://flags](chrome://flags). Then you should restart the browser

#### How to debug

Open [chrome://serviceworker-internals/](chrome://serviceworker-internals/), or alternatively use [chrome://inspect/#service-workers](chrome://inspect/#service-workers)

## Limitations notes

## Browser Support

![Chrome](https://raw.github.com/alrra/browser-logos/master/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/firefox/firefox_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/internet-explorer/internet-explorer_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/opera/opera_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/safari/safari_48x48.png)
--- | --- | --- | --- | --- |
Canary ✔ | Nightly ✔ | No | ? ✔ | No |

For more information about browser support see "[is ServiceWorker ready](https://jakearchibald.github.io/isserviceworkerready/)" site

## Basic usage

#### Mocking

```js
bock('http://www.google.com')
  .get('/search')
  .reply(200, 'Hello from Google!')
```

```js
bock('http://my.api.com')
  .post('/users/1')
  .headers({ 'Content-Type': 'application/json' })
  .replyWithHeaders({ 'Content-Type': 'text/xml' })
  .replyWithBody('<xml><user><name>Chuck Norris</name></user></xml>')
  .reply(200)
```

#### Proxy

Basic request proxy
```js
bock('http://my.api.com')
  .get('/users/1')
  .proxy('http://my.api.com/user/1')
  .forward()
```

Complex request proxy
```js
bock('http://my.api.com')
  .get('/users/1')
  .proxy('http://my.api.com/user/1')
  .withMethod('POST')
  .withHeaders({ Authorization: 'Bearer 0123456789' })
  .withBody('Hello World')
  .forward()
```

## API

### bock(baseUrl, [ options ])

Create a new `Bock` mocking/proxy scope

#### bock#get(path)

Intercept a GET request with the given URL path

#### bock#post(path)

Intercept a POST request with the given URL path

#### bock#put(path)

Intercept a PUT request with the given URL path

#### bock#delete(path)

Intercept a DELETE request with the given URL path

#### bock#head(path)

Intercept a HEAD request with the given URL path

#### bock#patch(path)

Intercept a PATCH request with the given URL path

#### bock#params(params)

Define the request params to match. Support is still in progress, use query search string at URI level instead

#### bock#body(body)

Define the request body to match. Note that body matching is currently not supported

#### bock#headers(headers)

Define the request headers to match

#### bock#auth(user, password)

Current not supported. Use `Authorization` header instead

#### body#replyHeaders(headers)
Alias: `replyWithHeaders()`

Define custom headers to inject in the mock response

#### body#replyBody(body)
Alias: `replyWithBody()`

Define a custom body data to inject in the mock response

#### body#reply(code, [ body, headers ])
Alias: `replyWith()`

Define the response status code to inject in the mock response, and optionally the response body and headers

#### bock#proxy(url, [ body, headers ])

Forward the matched request to another destination overriding the URL and optionally overriding a custom body and request headers

#### bock#withHeaders(headers)

Proxy mode only. Override the default request headers

#### bock#withMethod(method)

Proxy mode only. Override the default request method

#### bock#witBody(body)

Proxy mode only. Override the default request body

#### bock#credentials(type)

Proxy mode only. Define a custom request send credentials mode.
See [fetch][fetch-credentials] specification

#### bock#forward()

Proxy mode only. Enable request forwarding.
**You must call this method** to register a proxy request

### bock.isEnabled()
Alias: `isControllable()`

Return `true` if the ServiceWorker in currently controlling the current page

### bock.cleanAll()

Disable and flush all mocks/proxy configurations. Restore to initial state

### bock.mocks()

Return a collection of mocks configuration

### bock.stop()

Stop and unregister the ServiceWorker in the current scope.
Please be aware that the `ServiceWorker` livecycle is handled by the browser and it could persist if another tab/window is also using it

See the [spec][spec] for more information

### bock.VERSION
Type: `string`

Current library semantic version

## To Do list

- Support regular expressions for better versatility on URL pattern matching
- Smart body/payload matching for seriable data structures
- Workers <-> controlled pages scopes synchronization via `postMessage()`
- Add config persistency (see IndexedDB)
- Reliable way to close/unregister a worker (see spec)
- Support for easily handling of cache
- Support for request transforming
- Better fallback handling

## License

MIT - Tomas Aparicio

[serviceWorkerGettingStarted]: https://github.com/slightlyoff/ServiceWorker/blob/master/explainer.md#getting-started
[discussion]: https://github.com/slightlyoff/ServiceWorker/issues
[browser-support]: https://jakearchibald.github.io/isserviceworkerready/
[spec]: https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html
[explainer]: https://github.com/slightlyoff/ServiceWorker/blob/master/explainer.md#getting-started
[html5rocks]: http://www.html5rocks.com/en/tutorials/service-worker/introduction/
[travis]: https://travis-ci.org/h2non/bock
[fetch-credentials]: https://fetch.spec.whatwg.org/#concept-request-credentials-mode
