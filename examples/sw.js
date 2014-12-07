self.addEventListener('fetch', function(event) {
  if (/\.jpg$/.test(event.request.url)) {
    event.respondWith(
      fetch('http://ep01.epimg.net/iconos/v1.x/v1.4/logos/cabecera_interior.png', {
        mode: 'no-cors'
      })
    )
  } else if (/httpbin/.test(event.request.url)) {
    var salutation = 'Hello, ';
    var whom = decodeURIComponent(event.request.url.match(/\/([^/]*)$/)[1]);
    var energy_level = (whom == 'Cleveland')
        ? '!!!' // take it up to 11
        : '!';
    var version = '\n\n(Version 1)';

    var body = new Blob([salutation, whom, energy_level, version]);

    event.respondWith(new Response(body));
  }
})
