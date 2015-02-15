"use strict";
module.exports = function(http){
	http.get('/', function(req, res, next){
		req.url = '/index.html';
		next();
	});
};