describe('headers and footers', function () {
	describe('setting up a valid header test page height=string contents=string', function () {
		var app, route = '/test/header/validstrings';
		before(function () {
			app = require('../../lib/app.js').app;
			app.get(route, function (req, res) {
				res.status(200).send('<!doctype html><html lang=en><head><meta charset=utf-8><title>test</title></head>' +
					'<body><p>content</p><script>var html2pdf = {header:{height:"1cm",contents:"a"}}</script></body></html>');
			});
		});

		describe('getting test page', function () {
			var testUrl = 'localhost:' + config.http.port + route;
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
		});
	});
	describe('setting up a valid header test page height=string, contents=function', function () {
		var app, route = '/test/header/valid';
		before(function () {
			app = require('../../lib/app.js').app;
			app.get(route, function (req, res) {
				res.status(200).send('<!doctype html><html lang=en><head><meta charset=utf-8><title>test</title></head>' +
					'<body><p>content</p><script>var html2pdf = {header:{height:"1cm",contents:function(){return "a"}}}</script></body></html>');
			});
		});

		describe('getting test page', function () {
			var testUrl = 'localhost:' + config.http.port + route;
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
		});
	});
	describe('setting up a header test page with no height', function () {
		var app, route = '/test/header/missingheight';
		before(function () {
			app = require('../../lib/app.js').app;
			app.get(route, function (req, res) {
				res.status(200).send('<!doctype html><html lang=en><head><meta charset=utf-8><title>test</title></head>' +
					'<body><p>content</p><script>var html2pdf = {header:{contents:function(){return "a"}}}</script></body></html>');
			});
		});

		describe('getting test page', function () {
			var testUrl = 'localhost:' + config.http.port + route;
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

				it('should return statusCode 400', function () {
					expect(response, response.body).to.have.property('statusCode', 400);
				});

				it('should return validation error', function () {
					expect(response.body).to.contain('html2pdf.header.height has wrong type: null');
				});
			});
		});
	});

	describe('setting up a header test page with no contents', function () {
		var app, route = '/test/header/missingcontents';
		before(function () {
			app = require('../../lib/app.js').app;
			app.get(route, function (req, res) {
				res.status(200).send('<!doctype html><html lang=en><head><meta charset=utf-8><title>test</title></head>' +
					'<body><p>content</p><script>var html2pdf = {header:{height:"1cm"}}</script></body></html>');
			});
		});

		describe('getting test page', function () {
			var testUrl = 'localhost:' + config.http.port + route;
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

				it('should return statusCode 400', function () {
					expect(response, response.body).to.have.property('statusCode', 400);
				});

				it('should return validation error', function () {
					expect(response.body).to.contain('html2pdf.header.contents has wrong type: null');
				});
			});
		});
	});
});
