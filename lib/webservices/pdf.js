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

var phantom, queue;

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
		if (FORMATS.indexOf(paperFormat) === -1) {
			return res.send(400, format('Invalid format, the following are supported: %s', FORMATS.join(", ")));
		}
		var orientation = req.param("orientation") || "portrait";
		if (ORIENTATIONS.indexOf(orientation) === -1) {
			return res.send(400, format('Invalid orientation, the following are supported: %s', ORIENTATIONS.join(", ")));
		}
		req.connection.setTimeout(2 * 60 * 1000); //two minute timeout
		if (!phantom) {
			if (!queue) {
				queue = [getHead];
				return require("phantom").create(setupNewPhantom);
			}
			return queue.push(getHead);
		}
		getHead();

		function setupNewPhantom(ph) {
			phantom = ph;
			queue.forEach(function (fn) {
				fn();
			});
			queue = null;
		}

		function getHead() {
			request.head(url, function (err, resp) {
				if (err) {
					return res.send(400, format('Cannot get %s: %s', url, err.message));
				}
				if (!/2\d\d/.test(resp.statusCode)) {
					return res.send(400, format('Cannot get %s: http status code %s', url, resp.statusCode));
				}
				if (!/text|html/.test(resp.headers["content-type"])) {
					return res.send(400, format(
						'Cannot get %s: returns content type %s. You must point window.html2pdf.it to HTML or TEXT content',
						url,
						resp.headers["content-type"]
					));
				}
				generatePdf();
			});

			function generatePdf() {
				phantom.createPage(function (page) {
					page.viewportSize = { width: 600, height: 600 };
					page.paperSize = { format: format, orientation: orientation, margin: '1cm' };

					var statusCode;

					page.onResourceReceived = function (resource) {
						if (resource.url === url) {
							statusCode = resource.status;
						}
					};
					page.open(url, function (status) {
						if (status !== 'success') {
							return exitWithProblem('Unable to load the url (' + statusCode + '): ' + url + ": " + status);
						} else {
							return setUpHeaderOrFooter("header", function (err) {
								if (err) {
									return exitWithProblem(err);
								}
								return setUpHeaderOrFooter("footer", function (err) {
									if (err) {
										return exitWithProblem(err);
									}
									return setTimeout(function () {
										var tmpFile = path.join(__dirname, "../../tmp", uuid.v4() + ".pdf");
										page.render(tmpFile, function () {
											page.close();
											res.header("content-type", "application/pdf");
											if (req.param("download") === "true") {
												res.setHeader('Content-disposition', 'attachment; filename=' + slugifyUrl(url));
											}
											if (req.param("downloadToken")) {
												res.setHeader('Set-Cookie', 'downloadToken=' + req.param("downloadToken"));
											}
											var stream = fs.createReadStream(tmpFile);
											stream.pipe(res);
											stream.on("error", next);
											stream.on("close", function () {
												fs.unlink(tmpFile);
											});
										});
									}, 1000);
								});
							});
						}

						function exitWithProblem(message) {
							res.send(400, message);
							page.close();
						}

						function setUpHeaderOrFooter(headerOrFooter, callback) {
							page.evaluate(function () {
								return window.html2pdf;
							}, checkHeaderOrFooter);

							function checkHeaderOrFooter(html2pdf) {
								if (html2pdf && html2pdf[headerOrFooter]) {
									var height, contents;
									var typeOfHeight = html2pdf[headerOrFooter].height && typeof html2pdf[headerOrFooter].height;
									if (typeOfHeight === "string") {
										height = html2pdf[headerOrFooter].height;
									} else {
										return callback(new Error("html2pdf." + headerOrFooter + ".height has wrong type: " + typeOfHeight));
									}
									var typeOfContent = html2pdf[headerOrFooter].contents && typeof html2pdf[headerOrFooter].contents;
									if (typeOfContent === "string" || typeOfContent === "function") {
										contents = phantom.callback(function (pageNum, numPages) {
											return getHtmlWithInlineStyle(headerOrFooter, pageNum, numPages);
										});
									} else {
										return callback(new Error("html2pdf." + headerOrFooter + ".contents has wrong type: " + typeOfContent));
									}
									page.paperSize[headerOrFooter] = {
										height: height,
										contents: contents
									};
									return callback(null);
								}
							}
						}

						function getHtmlWithInlineStyle(headerOrFooter, pageNumber, totalPages) {
							return page.evaluate(function (headerOrFooter, pageNumber, totalPages) {
								var contents = window.html2pdf[headerOrFooter].contents;
								var html = typeof contents === "string" ?
									contents :
									window.html2pdf[headerOrFooter].contents(pageNumber, totalPages);
								html = html
									.replace(/\{\{pagenumber\}\}/gi, pageNumber)
									.replace(/\{\{totalpages\}\}/gi, totalPages);
								var host = document.createElement('div');
								host.innerHTML = html;
								document.body.appendChild(host);
								var elements = host.getElementsByTagName('*');
								for (var i in elements) {
									if (elements[i].className) {
										elements[i].setAttribute('style', window.getComputedStyle(elements[i], null).cssText);
									}
								}
								host.setAttribute('style', window.getComputedStyle(host, null).cssText);
								document.body.removeChild(host);
								document.body.setAttribute('style', window.getComputedStyle(document.body, null).cssText); //this is needed to re-render body
								return host.outerHTML;
							}, headerOrFooter, pageNumber, totalPages);
						}
					});
				});
			}
		}
	});
};