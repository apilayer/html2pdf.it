"use strict";
var express = require('express');

var env = process.env.APP_ENV || "production";
var config = require("../config/" + env + ".app.config.js");
var http = express();


http.configure(function () {
	http.use(express.logger());
	http.use(http.router);
	http.use(express.compress());
	http.use(express["static"](__dirname + '/../public', {clientMaxAge:-1000 * 60 * 60 * 24}));
});

require("./webservices/pdf.js")(http);
require("./websiteRoutes.js")(http);

http.listen(config.http.port);
console.log("Listening on http://localhost:" + config.http.port + "/");