// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-jasmine-html-reporter'),
      require('karma-chrome-launcher'),
      require('karma-coverage-istanbul-reporter'),
    ],
    files: ['tests.js'],
    autoWatch: false,
    browsers: ['ChromeHeadless'],
    customLaunchers: {
        HeadlessChrome: {
            base: 'ChromeHeadless',
            flags: [
	      '--no-sandbox',
	      '--headless',
              '--disable-gpu',
              '--disable-translate',
              '--disable-extensions'
	    ]
  	}
    },	
    singleRun: true,
    browserNoActivityTimeout: 120000,
    urlRoot: ''
  });
};
