exports.merge = function (target, origins) {
  var origins = Array.prototype.slice.call(arguments).slice(1)
  origins.forEach(function (origin) {
    for (var prop in origin) {
      target[prop] = origin[prop]
    }
  })
  return target
}

exports.uuid = function () {
  var uuid = '', i, random
  for (i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) uuid += '-'
    uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16)
  }
  return uuid
}
