"use strict";
var app = require("../../lib/app.js");
describe('pdf service', function() {

	it('returns well formed pdf response', function(done) {
		this.timeout(180000);
		var pdfUrl = "http://www.html2pdf.it";
		var url = "http://localhost:" + config.http.port +"/?url=" + encodeURIComponent(pdfUrl);
		request(url, function(err, res, body) {
			expect(res.statusCode).to.equal(200);
			expect(res.headers["content-type"]).to.equal("application/pdf");
			expect(body.substring(1, 4)).to.equal("PDF");
			done();
		});
	});
	xit('returns an error when there are JS errors', function(done) {
		this.timeout(180000);
		var pdfUrl = "http://localhost:" + config.http.port +"/javaScriptError.html";
		var url = "http://localhost:" + config.http.port +"/?url=" + encodeURIComponent(pdfUrl);
		request(url, function(err, res, body) {
			expect(res.statusCode).to.equal(412);
			done();
		});
	});
});
