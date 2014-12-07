var hasServiceWorker = 'serviceWorker' in navigator

module.exports = bock

function bock(url, options) {
  if (!hasServiceWorker) {
    throw new Error('Service Worker is not supported in this browser')
  }
  return new Bock(url, options)
}

bock.VERSION = '0.1.0'
bock.scope = '/'

