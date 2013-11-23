var page = require('webpage').create();
var system = require('system');
var address, output, size;

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
			return phantom.exit(100);
		} else {
			if (page.evaluate(function () {
				return typeof html2pdf === "object";
			})) {
				var paperSize = page.paperSize;
				setUpHeaderOrFooter("header");
				setUpHeaderOrFooter("footer");
				page.paperSize = paperSize;
			}
			return window.setTimeout(function () {
				page.render(output);
				phantom.exit();
			}, 1000);
		}

		function setUpHeaderOrFooter(headerOrFooter) {
			var hasHeaderOrFooter = page.evaluate(function (headerOrFooter) {
				return typeof html2pdf[headerOrFooter] === "object";
			}, headerOrFooter);
			if (hasHeaderOrFooter) {
				var height, contents;
				var typeOfHeight = page.evaluate(function (headerOrFooter) {
					return html2pdf[headerOrFooter].height && typeof html2pdf[headerOrFooter].height;
				}, headerOrFooter);
				if (typeOfHeight === "string") {
					height = page.evaluate(function (headerOrFooter) {
						return html2pdf[headerOrFooter].height;
					}, headerOrFooter);
				} else {
					console.error("html2pdf." + headerOrFooter + ".height has wrong type: " + typeOfHeight);
					return phantom.exit(100);
				}
				var typeOfContent = page.evaluate(function (headerOrFooter) {
					return html2pdf[headerOrFooter].contents && typeof html2pdf[headerOrFooter].contents;
				}, headerOrFooter);
				if (typeOfContent === "string" || typeOfContent === "function") {
					contents = phantom.callback(function (pageNum, numPages) {
						return getHtmlWithInlineStyle(headerOrFooter, pageNum, numPages);
					});
				} else {
					console.error("html2pdf." + headerOrFooter + ".contents has wrong type: " + typeOfContent);
					return phantom.exit(100);
				}
				paperSize[headerOrFooter] = {
					height: height,
					contents: contents
				};
				return null;
			}
		}

		function getHtmlWithInlineStyle(headerOrFooter, pageNumber, totalPages) {
			return page.evaluate(function (headerOrFooter, pageNumber, totalPages) {
				var contents = html2pdf[headerOrFooter].contents;
				var html = typeof contents === "string" ?
					contents :
					html2pdf[headerOrFooter].contents(pageNumber, totalPages);
				html = html
					.replace(/\{\{pagenumber\}\}/gi, pageNumber)
					.replace(/\{\{totalpages\}\}/gi, totalPages);
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
			}, headerOrFooter, pageNumber, totalPages);
		}
	});
}
