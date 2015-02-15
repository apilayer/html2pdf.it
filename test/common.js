global.sinon = require('sinon');
var chai = require('chai');
chai.config.includeStack = true;
global.expect = chai.expect;
global.request = require('request');
global._ = require('underscore');
var env = process.env.APP_ENV || 'production';
global.config = require('../config/' + env + '.app.config.js');
config.http.port = 8081;

chai.use(require('sinon-chai'));
