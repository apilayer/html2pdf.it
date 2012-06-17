#!/usr/bin/env node
var realExit = process.exit;
process.exit = function(){
	var args = arguments;
	setTimeout(function(){
		realExit.apply(process, args);
	}, 1000);
}

global.app = require("./source/app.js");
require('./node_modules/mocha/bin/_mocha');
