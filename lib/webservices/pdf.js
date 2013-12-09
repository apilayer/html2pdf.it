"use strict";
var spawn = require('child_process').spawn;
var path = require("path");
var fs = require("fs");
var uuid = require("node-uuid");
var format = require("util").format;
var request = require("request");
var slugifyUrl = require("slugify-url");

var pdfExecutable = "phantomjs";
if (process.platform === 'win32') {
	pdfExecutable = "phantomjs.exe";
}
if (process.platform !== "darwin") {
	pdfExecutable = path.resolve(path.join("bin", pdfExecutable));
}
var FORMATS = ['A3', 'A4', 'A5', 'Legal', 'Letter', 'Tabloid'];
var ORIENTATIONS = ['portrait', 'landscape'];

module.exports = function (app) {
	app.get("/", function (req, res, next) {
		var url = req.param("url");
		if (!url) {
			return next("route"); //skip to html view
		}
		if (url.indexOf("http://") !== 0 && url.indexOf("https://") !== 0) {
			url = "http://" + url;
		}
		var paperFormat = req.param("format") || "A4";
		if(FORMATS.indexOf(paperFormat) === -1){
			return res.send(400, format('Invalid format, the following are supported: %s', FORMATS.join(", ")));
		}
		var orientation = req.param("orientation") || "portrait";
		if(ORIENTATIONS.indexOf(orientation) === -1){
			return res.send(400, format('Invalid orientation, the following are supported: %s', ORIENTATIONS.join(", ")));
		}
		request.head(url, function (err, resp) {
			if (err) {
				return res.send(400, format('Cannot get %s: %s', url, err.message));
			}
			if (!/2\d\d/.test(resp.statusCode)) {
				return res.send(400, format('Cannot get %s: http status code %s', url, resp.statusCode));
			}
			if(!/text|html/.test(resp.headers["content-type"])){
				return res.send(400, format(
					'Cannot get %s: returns content type %s. You must point html2pdf.it to HTML or TEXT content',
					url,
					resp.headers["content-type"]
				));
			}
			generatePdf();

			function generatePdf() {
				var tmpFile = path.join(__dirname, "../../tmp", uuid.v4() + ".pdf");
				var outputLog = "";
				req.connection.setTimeout(2 * 60 * 1000); //two minute timeout
				var options = [
					'--web-security', 'no',
					path.join(__dirname, "../rasterize/rasterize.js"),
					url,
					tmpFile,
					paperFormat,
					orientation
				];
				var pdfProcess = spawn(pdfExecutable, options);
				pdfProcess.stdout.on('data', function (data) {
					console.log('pdf: ' + data);
					outputLog += data;
				});
				pdfProcess.stderr.on('data', function (data) {
					console.error('pdf: ' + data);
					outputLog += data;
				});
				pdfProcess.on('close', function (code) {
					if (code) {
						if(code===100){
							return res.send(400, outputLog);
						}
						return next(new Error("Wrong code: " + code));
					}
					res.header("content-type", "application/pdf");
					if(req.param("download")==="true"){
						res.setHeader('Content-disposition', 'attachment; filename=' + slugifyUrl(url) + '.pdf');
					}
					if(req.param("downloadToken")){
						res.setHeader('Set-Cookie', 'downloadToken=' + req.param("downloadToken"));
					}
					var stream = fs.createReadStream(tmpFile);
					stream.pipe(res);
					stream.on("error", next);
					stream.on("close", function () {
						fs.unlink(tmpFile);
					});
				});
			}
		});
	});
};