var mongoose = require("mongoose");


var movieSchema = new mongoose.Schema({
	mtitle:String,
	rating:String,
	duration:String,
	release:String,
	language:String,
	hero:String,
	heroine:String,
	director:String,
	music:String,
	poster:String
});



module.exports=mongoose.model("movie",movieSchema);