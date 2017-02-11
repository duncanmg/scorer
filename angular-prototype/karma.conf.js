module.exports = function(config) {
  config.set({
    basePath: '..',
    frameworks: ['jasmine'],
    // list of files / patterns to load in the browser
    files: [
        'tests/unit/**/*.js'
    ]
  });
};


