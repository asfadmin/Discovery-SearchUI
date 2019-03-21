var config = exports.config = require('./protractor.conf.js').config;

config.capabilities.chromeOptions.args = ['--window-size=800,600', '--no-sandbox'];
