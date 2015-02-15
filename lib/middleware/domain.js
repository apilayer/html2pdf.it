var domain = require('domain');
module.exports = function () {
	return function (req, res, next) {
		var requestDomain = domain.create();
		requestDomain.add(req);
		requestDomain.add(res);
		requestDomain.on('error', next);
		requestDomain.run(next);
	};
};