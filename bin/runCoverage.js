"use strict";
process.env.NODE_ENV = "coverage";
var nodecoverage = require("nodecoverage");
nodecoverage({
	instrument:["lib"],
	requireBeforeRun:["lib/app.js"]
}, function (err) {
	if (err) {
		console.error(err);
	}
	process.exit();
});
