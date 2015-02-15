describe('setting up a test page', function () {
	var app;
	before(function () {
		app = require('../../lib/app.js').app;
		app.get('/test', function (req, res) {
			res.status(200).send('<!doctype html><html lang=en><head><meta charset=utf-8><title>test</title></head>' +
				'<body><p>content</p></body></html>');
		});
	});

	describe('getting test page', function () {
		var testUrl = 'localhost:' + config.http.port + '/test';
		before(function (done) {
			return request('http://' + testUrl, function (err, resp) {
				if (err) {
					return done(err);
				}
				expect(resp, resp.body).to.have.property('statusCode', 200);
				return done();
			});
		});

		describe('getting a pdf of test page', function () {
			this.timeout(18000);
			var response;
			before(function (done) {
				var url = 'http://localhost:' + config.http.port + '/?url=' + encodeURIComponent('http://' + testUrl);
				return request(url, function (err, resp) {
					if (err) {
						return done(err);
					}
					response = resp;
					return done();
				});
			});

			it('should return statusCode 200', function () {
				expect(response, response.body).to.have.property('statusCode', 200);
			});

			it('should return application/pdf as content-type', function () {
				expect(response.headers).to.have.property('content-type', 'application/pdf');
			});

			it('should return content that looks like binary PDF', function () {
				expect(response.body.substring(1, 4)).to.equal('PDF');
			});
		});

		describe('getting a pdf of test page, without http://', function () {
			this.timeout(18000);
			var response;
			before(function (done) {
				var url = 'http://localhost:' + config.http.port + '/?url=' + encodeURIComponent(testUrl);
				return request(url, function (err, resp) {
					if (err) {
						return done(err);
					}
					response = resp;
					return done();
				});
			});

			it('should return statusCode 200', function () {
				expect(response, response.body).to.have.property('statusCode', 200);
			});

			it('should return application/pdf as content-type', function () {
				expect(response.headers).to.have.property('content-type', 'application/pdf');
			});

			it('should return content that looks like binary PDF', function () {
				expect(response.body.substring(1, 4)).to.equal('PDF');
			});
		});

		describe('getting a pdf of test page format A5', function () {
			this.timeout(18000);
			var response;
			before(function (done) {
				var url = 'http://localhost:' + config.http.port + '/?url=' + encodeURIComponent(testUrl) + '&format=A5';
				return request(url, function (err, resp) {
					if (err) {
						return done(err);
					}
					response = resp;
					return done();
				});
			});

			it('should return statusCode 200', function () {
				expect(response, response.body).to.have.property('statusCode', 200);
			});

			it('should return application/pdf as content-type', function () {
				expect(response.headers).to.have.property('content-type', 'application/pdf');
			});

			it('should return content that looks like binary PDF', function () {
				expect(response.body.substring(1, 4)).to.equal('PDF');
			});
		});

		describe('getting a pdf of test page margin 2in', function () {
			this.timeout(18000);
			var response;
			before(function (done) {
				var url = 'http://localhost:' + config.http.port + '/?url=' + encodeURIComponent(testUrl) + '&margin=2in';
				return request(url, function (err, resp) {
					if (err) {
						return done(err);
					}
					response = resp;
					return done();
				});
			});

			it('should return statusCode 200', function () {
				expect(response, response.body).to.have.property('statusCode', 200);
			});

			it('should return application/pdf as content-type', function () {
				expect(response.headers).to.have.property('content-type', 'application/pdf');
			});

			it('should return content that looks like binary PDF', function () {
				expect(response.body.substring(1, 4)).to.equal('PDF');
			});
		});

		describe('getting a pdf of test page invalid format', function () {
			this.timeout(18000);
			var response;
			before(function (done) {
				var url = 'http://localhost:' + config.http.port + '/?url=' + encodeURIComponent(testUrl) + '&format=INVALID';
				return request(url, function (err, resp) {
					if (err) {
						return done(err);
					}
					response = resp;
					return done();
				});
			});

			it('should return statusCode 400', function () {
				expect(response, response.body).to.have.property('statusCode', 400);
			});

			it('should return correct error message', function () {
				expect(response.body).to.equal(
					'Invalid format, the following are supported: A3, A4, A5, Legal, Letter, Tabloid'
				);
			});
		});

		describe('getting a pdf of test page orientation landscape', function () {
			this.timeout(18000);
			var response;
			before(function (done) {
				var url = 'http://localhost:' + config.http.port + '/?url=' + encodeURIComponent(testUrl) +
					'&orientation=landscape';
				return request(url, function (err, resp) {
					if (err) {
						return done(err);
					}
					response = resp;
					return done();
				});
			});

			it('should return statusCode 200', function () {
				expect(response, response.body).to.have.property('statusCode', 200);
			});

			it('should return application/pdf as content-type', function () {
				expect(response.headers).to.have.property('content-type', 'application/pdf');
			});

			it('should return content that looks like binary PDF', function () {
				expect(response.body.substring(1, 4)).to.equal('PDF');
			});
		});

		describe('getting a pdf of test page invalid orientation', function () {
			this.timeout(18000);
			var response;
			before(function (done) {
				var url = 'http://localhost:' + config.http.port + '/?url=' + encodeURIComponent(testUrl) + '&orientation=INVALID';
				return request(url, function (err, resp) {
					if (err) {
						return done(err);
					}
					response = resp;
					return done();
				});
			});

			it('should return statusCode 400', function () {
				expect(response, response.body).to.have.property('statusCode', 400);
			});

			it('should return correct error message', function () {
				expect(response.body).to.equal(
					'Invalid orientation, the following are supported: portrait, landscape'
				);
			});
		});

		describe('getting a pdf of test page invalid margin', function () {
			this.timeout(18000);
			var response;
			before(function (done) {
				var url = 'http://localhost:' + config.http.port + '/?url=' + encodeURIComponent(testUrl) + '&margin=INVALID';
				return request(url, function (err, resp) {
					if (err) {
						return done(err);
					}
					response = resp;
					return done();
				});
			});

			it('should return statusCode 400', function () {
				expect(response, response.body).to.have.property('statusCode', 400);
			});

			it('should return correct error message', function () {
				expect(response.body).to.equal(
					'Invalid margin, the following formats are supported: 0cm, 1cm, 2cm, 1in, 13mm'
				);
			});
		});

		describe('getting a pdf of a pdf of test page', function () {
			this.timeout(18000);
			var response;
			before(function (done) {
				var pdfUrl = 'http://localhost:' + config.http.port + '/?url=' + encodeURIComponent(testUrl);
				var url = 'http://localhost:' + config.http.port + '/?url=' + encodeURIComponent(pdfUrl);
				return request(url, function (err, resp) {
					if (err) {
						return done(err);
					}
					response = resp;
					return done();
				});
			});

			it('should return statusCode 400', function () {
				expect(response, response.body).to.have.property('statusCode', 400);
			});

			it('should return error message', function () {
				expect(response.body).to.equal('Cannot get http://localhost:8081/?url=localhost%3A8081%2Ftest:' +
					' returns content type application/pdf. You must point html2pdf.it to HTML or TEXT content');
			});
		});
	});
});