"use strict";
var fs = require("fs");
var path = require("path");

runJsHint(["./lib", "./test", "./bin"], function (err) {
	if (err) {
		console.error("Exiting because of jsHint errors");
		return process.exit(1);
	}
	console.log("No JSHint errors detected");
	return runMocha();
});

function runMocha() {
	var realExit = process.exit;
	process.exit = function () {
		var args = arguments;
		//stdout does not flush data output before exiting the process, this compensates
		process.stdout.once("drain", function (){
			setTimeout(function(){
				realExit.apply(process, args);
			}, 500);
		});
	};
	require('../node_modules/mocha/bin/_mocha');
}

function runJsHint(pathsArray, callback) {
	var jsHint = require("../node_modules/jshint/lib/hint.js");
	var config = JSON.parse(fs.readFileSync(__dirname + "/../.jshintrc", "utf-8"));
	var reporter = require("../node_modules/jshint/lib/reporters/default.js").reporter;
	var ignoreFile = __dirname + "/../.jshintignore";
	var ignores = fs.readFileSync(ignoreFile, "utf8").split("\n")
		.filter(function (line) {
			return !!line.trim();
		})
		.map(function (line) {
			return path.resolve(path.dirname(ignoreFile), line.trim());
		});
	var results = jsHint.hint(pathsArray, config, reporter, ignores);
	if (results.length > 0) {
		//stdout does not flush data output before exiting the process, this compensates
		return process.stdout.once("drain", function () {
			return callback(new Error("JSHintErrors"));
		});
	}
	return callback(null);
}