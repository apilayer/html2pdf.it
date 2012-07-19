"use strict";
var nodecoverage = require("nodecoverage");
var fs = require("fs");

process.env.NODE_ENV = "coverage";
//make writes to stdout and stderr sync, so the process does not exit before writing output.
process.stdout.write = function (data){
	fs.writeSync(1, data);
};
process.stderr.write = function (data){
	fs.writeSync(2, data);
};

nodecoverage({
	instrument:["lib"],
	requireBeforeRun:["lib/app.js"]
}, function (err) {
	if (err) {
		console.error(err);
	}
	process.exit();
});
