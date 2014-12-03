// Set the callback for the install step
self.addEventListener('install', function(ev) {
  console.log(ev)
})

self.addEventListener('activate', function(event) {
  // You're good to go!
})

self.addEventListener('fetch', function (ev) {
  console.log(ev.request)
  ev.respondWith(new Response("Hello world!"))
})
