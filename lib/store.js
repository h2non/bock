var buf = []
var store = exports

store.append = function (data) {
  buf.push(data)
}

store.remove = function (id) {
  var item = store.get(id)
  if (item) buf.splice(buf.indexOf(item), 1)
}

store.get = function (id) {
  var i, l, isString = typeof id === 'string'
  for (i = 0, l = buf.length; i < l; i += 1) {
    if ((isString && buf[i].id === id) || buf[i] === id) {
      return buf[i]
    }
  }
  return null
}

store.all = function () {
  return buf.map(function (mock) {
    return { id: mock.id, config: mock.config }
  })
}

store.flush = function () {
  buf.splice(0)
}
