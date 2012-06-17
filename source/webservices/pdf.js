var spawn = require('child_process').spawn;
var path = require("path");

var pdfExecutable = "wkhtmltopdf-linux-amd64";
if (process.platform == 'win32') {
	pdfExecutable = "wkhtmltopdfWindows/wkhtmltopdf.exe";
}

module.exports = function (http) {

	http.get("/pdf", function (req, res, next) {
		req.connection.setTimeout(2 * 60 * 1000); //two minute timeout
		var url = req.param("url");
		var output = [], logOutput = [], errorOccurred = false;

		var pdfProcess = spawn(path.join(__dirname, "/../../bin/", pdfExecutable), [
			"--enable-javascript",
			"--debug-javascript",
			"--javascript-delay", 500,
			"--print-media-type",
			"--margin-left", "0.0",
			"--margin-top", "0.0",
			"--margin-right", "0.0",
			"--margin-bottom", "0.0",
			url,
			"-"
		]);

		pdfProcess.stdout.on('data', function (data) {
			output.push(data);
		});

		pdfProcess.stdout.on('close', function () {
			if (!errorOccurred) {
				res.header("content-type", "application/pdf");
				res.header('Content-Disposition', 'attachment; filename="downloaded.pdf"');
				for (var i = 0; i < output.length; i++) {
					res.write(output[i]);
				}
				res.end();
			}
		});

		pdfProcess.stderr.on('data', function (data) {
			var dataString = data.toString();
			logOutput.push(dataString);
			if (dataString.indexOf("Warning:") !== -1) {
				errorOccurred = true;
				pdfProcess.stderr.on('close', function(){
					res.statusCode = 412;
					res.write(logOutput.join(""));
					res.end();
				});
				pdfProcess.kill();
			}
		});
	});
};