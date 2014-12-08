var store = exports
var buf = []

store.append = function (data) {
  buf.push(data)
}

store.remove = function (id) {
  var item = store.get(id)
  if (item) buf.splice(1, item.indexOf(item))
}

store.get = function (id) {
  for (var i = 0, l = buf.length; i < l; i += 1) {
    if (buf[i].id === id) {
      return buf[i]
    }
  }
  return null
}

store.flush = function () {
  buf.splice(0)
}

store.all = function () {
  return buf.slice()
}
