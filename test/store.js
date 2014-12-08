var expect = require('chai').expect
var store = require('../lib/store')

describe('store', function () {
  before(function () {
    store.flush()
  })

  it('should append an item', function () {
    store.append({ id: 'id', config: 1 })
  })

  it('should retrieve an existent item', function () {
    expect(store.get('id')).to.be.deep.equal({ id: 'id', config: 1 })
  })

  it('should not retrieve a non existent item', function () {
    expect(store.get(-1)).to.be.null
  })

  it('should retrieve all the items', function () {
    expect(store.all()).to.have.length(1)
    expect(store.all()).to.be.deep.equal([{ id: 'id', config: 1 }])
  })

  it('should not remove a non existent item', function () {
    store.remove(-1)
    expect(store.all()).to.be.deep.equal([{ id: 'id', config: 1 }])
  })

  it('should remove an existent item', function () {
    store.remove('id')
    expect(store.all()).to.be.have.length(0)
  })

  it('should flush all the buffer', function () {
    store.flush()
    expect(store.all()).to.have.length(0)
  })
})
