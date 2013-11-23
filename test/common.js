global.sinon = require('sinon');
var chai = require('chai');
chai.Assertion.includeStack = true;
global.expect = chai.expect;
global.request = require("request");
global._ = require("underscore");
var env = process.env.APP_ENV || "production";
global.config = require("../config/" + env + ".app.config.js");

chai.use(require('sinon-chai'));
