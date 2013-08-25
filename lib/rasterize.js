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
			if (page.evaluate(function () {
				return typeof html2pdf == "object";
			})) {
				paperSize = page.paperSize;
				paperSize.header = {};
				paperSize.header.height = page.evaluate(function () {
					return html2pdf.header.height;
				});
				paperSize.header.contents = phantom.callback(function (pageNum, numPages) {
					return getHtmlWithInlineStyle("header", pageNum, numPages);
				});
				//paperSize.header.contents = replaceClassWithStyle(paperSize.header.contents);
				paperSize.footer = {};
				paperSize.footer.height = page.evaluate(function () {
					return html2pdf.footer.height;
				});
				paperSize.footer.contents = phantom.callback(function (pageNum, numPages) {
					return getHtmlWithInlineStyle("footer", pageNum, numPages);
				});
				page.paperSize = paperSize;
			}
			return window.setTimeout(function () {
				page.render(output);
				phantom.exit();
			}, 1000);

			function getHtmlWithInlineStyle(headerOrFooter, pageNum, numPages) {
				return page.evaluate(function (headerOrFooter, pageNum, numPages) {
					var html = html2pdf[headerOrFooter].contents(pageNum, numPages);
					var host = document.createElement('div');
					host.innerHTML = html;
					document.body.appendChild(host);
					var elements = host.getElementsByTagName('*');
					for (var i in elements) {
						if (elements[i].className) {
							elements[i].setAttribute('style', window.getComputedStyle(elements[i], null).cssText);
						}
					}
					host.setAttribute('style', window.getComputedStyle(host, null).cssText);
					document.body.removeChild(host);
					document.body.setAttribute('style', window.getComputedStyle(document.body, null).cssText); //this is needed to re-render body
					return host.outerHTML;
				}, headerOrFooter, pageNum, numPages);
			}

		}
	});
}
