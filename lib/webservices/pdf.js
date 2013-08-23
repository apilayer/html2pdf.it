"use strict";
var spawn = require('child_process').spawn;
var path = require("path");
var fs = require("fs");
var uuid = require("node-uuid");

var pdfExecutable = "phantomjs";
if (process.platform === 'win32') {
	pdfExecutable = "phantomjs.exe";
}
if (process.platform !== "darwin") {
	pdfExecutable = path.resolve(path.join("bin", pdfExecutable));
}

module.exports = function (app) {
	app.get("/", function (req, res, next) {
		var url = req.param("url");
		if (!url) {
			return next("route"); //skip to html view
		}
		var tmpFile = path.join(__dirname, "../../tmp", uuid.v4() + ".pdf");
		req.connection.setTimeout(2 * 60 * 1000); //two minute timeout
		var options = [
			'--web-security', 'no',
			path.join(__dirname, "../rasterize.js"),
			url,
			tmpFile,
			"A4"
		];
		var pdfProcess = spawn(pdfExecutable, options);
		pdfProcess.stdout.on('data', function (data) {
			console.log('stdout: ' + data);
		});
		pdfProcess.stderr.on('data', function (data) {
			console.log('stderr: ' + data);
		});
		pdfProcess.on('close', function (code) {
			if(code){
				return next(new Error("Wrong code: " + code));
			}
			res.header("content-type", "application/pdf");
			var stream = fs.createReadStream(tmpFile);
			stream.pipe(res);
			stream.on("error", next);
			stream.on("close", function () {
				fs.unlink(tmpFile);
			});
		});
	});
};