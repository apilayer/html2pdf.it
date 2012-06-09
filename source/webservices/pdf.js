var spawn = require('child_process').spawn;
var path = require("path");

var pdfExecutable = "wkhtmltopdf-linux-amd64";

module.exports = function(http){

	http.get("/pdf", function(req, res, next){
		var url = req.param("url");

		var pdfProcess = spawn(path.join(__dirname, "/../../bin/", pdfExecutable), ["-", "--javascript-delay", 500, url]);

		pdfProcess.stdout.on('data', function(data) {
			res.write(data);
		});

		pdfProcess.stderr.on('data', function(data) {
			console.log('stderr: ' + data);
		});

		pdfProcess.on('exit', function(code) {
			console.log('pdf process exited with code ' + code);
			res.end();
		});
	});
};