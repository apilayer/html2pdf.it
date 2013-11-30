"use strict";
var path = require('path');
var express = require('express');
var middleware = require("./middleware");

var env = process.env.APP_ENV || "production";
var config = require("../config/" + env + ".app.config.js");
var app = express();

process.chdir(path.join(__dirname, '..'));

app.configure(function () {
	app.use(middleware.domain());
	app.use(express.logger());
	app.use(app.router);
	app.use(express.compress());
	app.use(express["static"](__dirname + '/../public', {clientMaxAge:-1000 * 60 * 60 * 24}));
	app.use(function(err, req, res, next){
		console.error(err.stack);
		res.send(500, 'Something broke!');
	});
});

require("./webservices/pdf.js")(app);
require("./websiteRoutes.js")(app);

app.listen(config.http.port);
console.log("Listening on http://localhost:" + config.http.port + "/");

module.exports =  {
	app: app
};