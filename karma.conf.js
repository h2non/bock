module.exports = function(config) {
  config.set({
    files: [
      'node_modules/chai/chai.js',
      'bock.js',
      'bock.worker.js',
      'test/bock.js'
    ],
    frameworks: ['mocha'],
    browsers: [
      'ChromeCanary'
      //'FirefoxNightly'
    ],
    reports: ['progress'],
    singleRun: false
  })
}
