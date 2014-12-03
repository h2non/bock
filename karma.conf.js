module.exports = function(config) {
  config.set({
    files: [
      'node_modules/chai/chai.js',
      'bock.js',
      'test/bock.js'
    ],
    frameworks: ['mocha'],
    browsers: [
      'ChromeCanary',
      'Firefox'
    ], 
    reports: ['progress'],
    singleRun: true
  })
}
