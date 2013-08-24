describe("setting up a test page", function () {
	var app;
	before(function () {
		app = require("../../lib/app.js").app;
		app.get("/test", function (req, res) {
			res.send(200, '<!doctype html><html lang=en><head><meta charset=utf-8><title>test</title></head>' +
				'<body><p>content</p></body></html>');
		});
	});

	describe('getting test page', function () {
		var testUrl = "localhost:" + config.http.port + "/test";
		before(function (done) {
			return request("http://" + testUrl, function (err, resp) {
				if (err) {
					return done(err);
				}
				expect(resp, resp.body).to.have.property("statusCode", 200);
				return done();
			});
		});

		describe('getting a pdf of test page', function () {
			this.timeout(18000);
			var response;
			before(function (done) {
				var url = "http://localhost:" + config.http.port + "/?url=" + encodeURIComponent("http://" + testUrl);
				return request(url, function (err, resp) {
					if (err) {
						return done(err);
					}
					response = resp;
					return done();
				});
			});

			it('should return statusCode 200', function () {
				expect(response, response.body).to.have.property("statusCode", 200);
			});

			it('should return application/pdf as content-type', function () {
				expect(response.headers).to.have.property("content-type", "application/pdf");
			});

			it('should return content that looks like binary PDF', function () {
				expect(response.body.substring(1, 4)).to.equal("PDF");
			});
		});

		describe('getting a pdf of test page, without http://', function () {
			this.timeout(18000);
			var response;
			before(function (done) {
				var url = "http://localhost:" + config.http.port + "/?url=" + encodeURIComponent(testUrl);
				return request(url, function (err, resp) {
					if (err) {
						return done(err);
					}
					response = resp;
					return done();
				});
			});

			it('should return statusCode 200', function () {
				expect(response, response.body).to.have.property("statusCode", 200);
			});

			it('should return application/pdf as content-type', function () {
				expect(response.headers).to.have.property("content-type", "application/pdf");
			});

			it('should return content that looks like binary PDF', function () {
				expect(response.body.substring(1, 4)).to.equal("PDF");
			});
		});
	});
});