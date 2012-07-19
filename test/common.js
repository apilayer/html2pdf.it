global.sinon = require('sinon');
var chai = require('chai');
global.chai = chai;
global.expect = chai.expect;
global.request = require("request");
global.requiremock = require("requiremock");
global._ = require("underscore");
var env = process.env.APP_ENV || "production";
global.config = require("../config/" + env + ".app.config.js");

chai.use(require('sinon-chai'));
