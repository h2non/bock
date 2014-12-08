var expect = require('chai').expect
var _ = require('../lib/utils')

describe('utils', function () {
  describe('merge', function () {
    var a = { a: 1 }

    it('should merge object members mutating the first one', function () {
      _.merge(a, { b: 2 })
      expect(a).to.be.deep.equal({ a: 1, b: 2 })
    })

    it('should merge object multiple objects', function () {
      _.merge(a, { b: 2 }, { c: 3 }, { d: 4})
      expect(a).to.be.deep.equal({ a: 1, b: 2, c: 3, d: 4 })
    })
  })

  describe('uuid', function () {
    it('should generate a valid UUID v4', function () {
      expect(_.uuid()).to.match(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
    })
  })
})
