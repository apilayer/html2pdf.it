var mocha = new (require('mocha'));

require("../source/app.js");

mocha.reporter('dot').ui('bdd');

//mocha.addFile('tests/x.js');

var runner = mocha.run(function(){
	console.log('done');
});

runner.on('fail', function(test){
	console.log('. %s failed', test.title);
});

runner.on('pass', function(test){
	console.log('. %s passed', test.title);
});

