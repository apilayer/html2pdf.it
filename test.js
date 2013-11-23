#!/usr/bin/env node
//run Mocha
var realProcessExit = process.exit;
process.exit = function (code) {
	setTimeout(realProcessExit.bind(process, code), 2000);
};
require('./node_modules/mocha/bin/_mocha');