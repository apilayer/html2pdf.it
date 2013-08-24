var page = require('webpage').create(),
	system = require('system'),
	address, output, size;

if (system.args.length < 3 || system.args.length > 5) {
	console.log('Usage: rasterize.js URL filename paperwidth*paperheight|paperformat portrait|landscape');
	console.log('  paper (pdf output) examples: "5in*7.5in", "10cm*20cm", "A4", "Letter"');
	phantom.exit(1);
} else {
	address = system.args[1];
	output = system.args[2];
	page.viewportSize = { width: 600, height: 600 };
	//size
	size = system.args[3].split('*');
	page.paperSize =
		size.length === 2 ?
		{ width: size[0], height: size[1], margin: '0px' } :
		{ format: system.args[3], orientation: system.args[4], margin: '1cm' };

	var statusCode;

	page.onResourceReceived = function (resource) {
		if (resource.url === address) {
			statusCode = resource.status;
		}
	};
	page.open(address, function (status) {
		if (status !== 'success') {
			console.error('Unable to load the address (' + statusCode + '): ' + address, status);
			phantom.exit();
		} else {
			window.setTimeout(function () {
				page.render(output);
				phantom.exit();
			}, 1000);
		}
	});
}