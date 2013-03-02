"use strict";
var spawn = require('child_process').spawn;
var path = require("path");
var fs = require("fs");
var uuid = require("node-uuid");

var pdfExecutable = "phantomjs";
if (process.platform === 'win32') {
	pdfExecutable = "phantomjs.exe";
}
pdfExecutable = path.resolve(path.join("bin", pdfExecutable));

module.exports = function (http) {
	http.get("/", function (req, res, next) {
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

		pdfProcess.on('exit', function () {
			res.header("content-type", "application/pdf");
			var stream = fs.createReadStream(tmpFile);
			stream.pipe(res);
			stream.on("error", function(err){
				console.log(err);
			});
			stream.on("close", function(){
				fs.unlink(tmpFile);
			});
		});
	});
};