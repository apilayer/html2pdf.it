"use strict";
var path = require('path');
var express = require('express');
var middleware = require('./middleware');
var compression = require('compression');
var morgan = require('morgan');

var env = process.env.APP_ENV || 'production';
var config = require('../config/' + env + '.app.config.js');
var app = express();

process.chdir(path.join(__dirname, '..'));

app.use(middleware.domain());
app.use(morgan('combined'));
app.use(compression());
require('./webservices/pdf.js')(app);
require('./websiteRoutes.js')(app);
app.use(express['static'](__dirname + '/../public', {clientMaxAge: -1000 * 60 * 60 * 24}));
app.use(express['static'](__dirname + '/../favicon', {clientMaxAge: -1000 * 60 * 60 * 24}));
app.use(function (err, req, res, next) {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});




app.listen(config.http.port);
console.log('Listening on http://localhost:' + config.http.port + '/');

module.exports = {
	app: app
};