"use strict";
var fs = require("fs");
var path = require("path");

//make writes to stdout and stderr sync, so the process does not exit before writing output.
process.stdout.write = function (data){
	fs.writeSync(1, data);
};
process.stderr.write = function (data){
	fs.writeSync(2, data);
};

//runJsHint(["lib", "test", "bin"], function (err) {
//	if (err) {
//		console.error("Exiting because of jsHint errors");
//		return process.exit(1);
//	}
//	console.log("No JSHint errors detected");
	return runMocha();
//});

function runMocha() {
	require('../node_modules/mocha/bin/_mocha');
}

function runJsHint(pathsArray, callback) {
	var jsHint = require("../node_modules/jshint/lib/hint.js");
	var config = JSON.parse(fs.readFileSync(path.resolve(".jshintrc"), "utf-8"));
	var reporter = require("../node_modules/jshint/lib/reporters/default.js").reporter;
	var ignores = fs.readFileSync(path.resolve(".jshintignore"), "utf8").split("\n")
		.filter(function (line) {
			return !!line.trim(); //remove empty lines
		})
		.map(path.resolve);
	var results = jsHint.hint(pathsArray, config, reporter, ignores);
	if (results.length > 0) {
		return callback(new Error("JSHintErrors"));
	}
	return callback(null);
}