var express = require('express');
var env = process.env.APP_ENV || "production";
var config = require("../config/" + env + ".app.config.js");
var http = express.createServer();

require("./webservices/pdf.js")(http);

http.listen(config.http.port);
console.log("Listening on http://localhost:" + config.http.port + "/");