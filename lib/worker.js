// Set the callback for the install step
//self.addEventListener('install', function (ev) {
  //console.log(ev)
//})

self.addEventListener('activate', function (event) {
  console.log('Worker activated')
  event.respondWith()
})

self.addEventListener('fetch', function (ev) {
  var salutation = 'Hello, '
  var whom = decodeURIComponent(ev.request.url.match(/\/([^/]*)$/)[1])
  var energy_level = (whom == 'Cleveland')
      ? '!!!' // take it up to 11
      : '!'
  var version = '\n\n(Version 1)'

  var body = new Blob([salutation, whom, energy_level, version])

  ev.respondWith(new Response(body))
})
