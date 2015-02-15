(function () {
	var spinner, downloading;
	document.getElementById('pdfForm').onsubmit = spinme;
	function spinme(e) {
		if (downloading) {
			e = e || window.event;
			e.preventDefault && e.preventDefault();
			return false;
		}
		expireCookie('downloadToken');
		var target = document.getElementById('doDownload').value === 'true' ? 'downloadFrame' : '';
		document.getElementById('pdfForm').target = target;
		var opts = {
			lines: 13, // The number of lines to draw
			length: 70, // The length of each line
			width: 10, // The line thickness
			radius: 55, // The radius of the inner circle
			rotate: 0, // The rotation offset
			color: '#000', // #rgb or #rrggbb
			speed: 2, // Rounds per second
			trail: 60, // Afterglow percentage
			shadow: false, // Whether to render a shadow
			hwaccel: false, // Whether to use hardware acceleration
			className: 'spinner', // The CSS class to assign to the spinner
			zIndex: 2e9, // The z-index (defaults to 2000000000)
			top: 'auto', // Top position relative to parent in px
			left: 'auto' // Left position relative to parent in px
		};
		var spinTarget = document.getElementById('pdfForm');
		spinner = (spinner || (Spinner && new Spinner(opts)));
		spinner && spinner.spin(spinTarget);
		var downloadTimer;
		var attempts = 2 * 60;
		return blockResubmit();

		function getCookie(name) {
			var parts = document.cookie.split(name + '=');
			if (parts.length === 2) {
				return parts.pop().split(';').shift();
			}
			return null;
		}

		function expireCookie(cName) {
			document.cookie = encodeURIComponent(cName) + '=deleted; expires=' + new Date(0).toUTCString();
		}

		function setCursor(docStyle, buttonStyle) {
			document.body.style.cursor = docStyle;
			spinTarget.style.cursor = buttonStyle;
		}

		function setFormToken() {
			var downloadToken = new Date().getTime().toString();
			document.getElementById('downloadToken').value = downloadToken;
			return downloadToken;
		}

		// Prevents double-submits by waiting for a cookie from the server.
		function blockResubmit() {
			downloading = true;
			var downloadToken = setFormToken();
			setCursor('wait', 'wait');
			downloadTimer = window.setInterval(function () {
				var token = getCookie('downloadToken');
				if ((token === downloadToken) || (attempts === 0)) {
					unblockSubmit();
				}
				attempts--;
			}, 1000);
			document.getElementById('getPdfButton').disabled = true;
		}

		function unblockSubmit() {
			expireCookie('downloadToken');
			spinner && spinner.stop();
			downloading = false;
			window.clearInterval(downloadTimer);
			document.getElementById('getPdfButton').disabled = false;
			setCursor('auto', 'pointer');
		}
	}
})();