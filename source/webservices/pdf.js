module.exports = function(http){

	http.get("/pdf", function(req, res, next){
		res.json("we're up and running");
	});
}