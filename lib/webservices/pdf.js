"use strict";
var spawn = require('child_process').spawn;
var path = require('path');
var fs = require('fs');
var uuid = require('node-uuid');
var format = require('util').format;
var request = require('request');
var slugifyUrl = require('slugify-url');

var pdfExecutable = require('phantomjs-prebuilt').path;
var FORMATS = ['A3', 'A4', 'A5', 'Legal', 'Letter', 'Tabloid'];
var ORIENTATIONS = ['portrait', 'landscape'];
var marginRegExp = /^((\d)|(\d\.\d))+(in|cm|mm)$/;
var zoomRegExp = /^\d(\.\d{1,3})?$/;

module.exports = function (app) {
	app.get('/', function (req, res, next) {
		var url = req.query.url;
		var filename = slugifyUrl(url);
		
		if (req.query.filename) {
			filename = req.query.filename;
		}
		
		if (!url) {
			return next('route'); //skip to html view
		}
		if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
			url = 'http://' + url;
		}
		var paperFormat = req.query.format || 'A4';
		if(FORMATS.indexOf(paperFormat) === -1){
			return res.status(400).send(format('Invalid format, the following are supported: %s', FORMATS.join(', ')));
		}
		var orientation = req.query.orientation || 'portrait';
		if(ORIENTATIONS.indexOf(orientation) === -1){
			return res.status(400).send(format('Invalid orientation, the following are supported: %s', ORIENTATIONS.join(', ')));
		}
		var margin = req.query.margin || '1cm';
		if(!marginRegExp.test(margin)){
			return res.status(400).send(format('Invalid margin, the following formats are supported: 0cm, 1cm, 2cm, 1in, 13mm'));
		}
		var zoom = req.query.zoom || '1';
		if(!zoomRegExp.test(zoom)){
			return res.status(400).send(format('Invalid zoom, the following kind of formats are supported: 1, 0.5, 9.25, 0.105'));
		}

		request.head(url, function (err, resp) {
			if (err) {
				return res.status(400).send(format('Cannot get %s: %s', url, err.message));
			}
			if (!/2\d\d/.test(resp.statusCode)) {
				return res.status(400).send(format('Cannot get %s: http status code %s', url, resp.statusCode));
			}
			if(!/text|html/.test(resp.headers['content-type'])){
				return res.status(400).send(format(
					'Cannot get %s: returns content type %s. You must point html2pdf.it to HTML or TEXT content',
					url,
					resp.headers['content-type']
				));
			}
			generatePdf();

			function generatePdf() {
				var tmpFile = path.join(__dirname, '../../tmp', uuid.v4() + '.pdf');
				var outputLog = '';
				req.connection.setTimeout(2 * 60 * 1000); //two minute timeout
				var options = [
					'--web-security=no',
					'--ssl-protocol=any',
					path.join(__dirname, '../rasterize/rasterize.js'),
					url,
					tmpFile,
					paperFormat,
					orientation,
					margin,
					zoom
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
							return res.status(400).send(outputLog);
						}
						return next(new Error('Wrong code: ' + code));
					}
					res.header('content-type', 'application/pdf');
					if(req.query.download==='true'){
						res.setHeader('Content-disposition', 'attachment; filename=' + filename + '.pdf');
					}
					if(req.query.downloadToken){
						res.setHeader('Set-Cookie', 'downloadToken=' + req.query.downloadToken);
					}
					var stream = fs.createReadStream(tmpFile);
					stream.pipe(res);
					stream.on('error', next);
					stream.on('close', function () {
						fs.unlink(tmpFile);
					});
				});
			}
		});
	});
};
