var expect = chai.expect

describe('Bock', function () {
  bock.workerPath = '/base/bock.worker.js'

  describe('mocking', function () {
    describe('basic', function () {
      bock('http://google.com')
        .get('/search')
        .reply(204)

      after(function () {
        bock.cleanAll()
      })

      it('should respond with a valid status code', function (done) {
        lil.http('http://google.com/search', function (err, res) {
          expect(res.status).to.be.equal(204)
          done()
        })
      })
    })

    describe('request headers', function () {
      bock('http://google.com')
        .get('/search')
        .headers({ Accept: 'application/json' })
        .reply(204)

      after(function () {
        bock.cleanAll()
      })

      it('should respond with a valid status code', function (done) {
        lil.http('http://google.com/search', { Accept: 'application/json' }, function (err, res) {
          expect(res.status).to.be.equal(204)
          done()
        })
      })
    })

    describe('body', function () {
      bock('http://google.com')
        .get('/search')
        .reply(200, 'Hello World')

      after(function () {
        bock.cleanAll()
      })

      it('should respond with a valid status code', function (done) {
        lil.http('http://google.com/search', function (err, res) {
          expect(res.status).to.be.equal(200)
          expect(res.data).to.be.equal('Hello World')
          done()
        })
      })
    })

    describe('response headers', function () {
      bock('http://google.com')
        .get('/search')
        .reply(200, 'Hello World')

      after(function () {
        bock.cleanAll()
      })

      it('should respond with a valid status code', function (done) {
        lil.http('http://google.com/search', function (err, res) {
          expect(res.status).to.be.equal(200)
          expect(res.data).to.be.equal('Hello World')
          done()
        })
      })
    })
  })

  describe('proxy', function () {
    describe('basic', function () {
      bock('http://google.com')
        .get('/search')
        .proxy('http://httpbin.org/status/204')
        .forward()

      after(function () {
        bock.cleanAll()
      })

      it('should respond with a valid status code', function (done) {
        lil.http('http://google.com/search', function (err, res) {
          expect(res.status).to.be.equal(204)
          done()
        })
      })
    })

    describe('request headers', function () {
      bock('http://google.com')
        .get('/search')
        .headers({ Accept: 'application/json' })
        .proxy('http://httpbin.org/headers')
        .forward()

      after(function () {
        bock.cleanAll()
      })

      it('should respond with a valid status code', function (done) {
        lil.http('http://google.com/search', { Accept: 'application/json' }, function (err, res) {
          expect(res.status).to.be.equal(204)
          done()
        })
      })
    })
  })
})
