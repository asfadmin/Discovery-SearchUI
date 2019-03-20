// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
const ChromiumRevision = require('puppeteer/package.json').puppeteer.chromium_revision
const Downloader = require('puppeteer/utils/ChromiumDownloader')
const revisionInfo = Downloader.revisionInfo(Downloader.currentPlatform(), ChromiumRevision)

process.env.CHROME_BIN = puppeteer.executablePath();

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-jasmine-html-reporter'),
      require('karma-chrome-launcher'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    singleRun: true
  });
};
