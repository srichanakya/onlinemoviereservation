var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	name:String,
	username:String,
	password:String,
	email:String,
	phone:String
});

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("user",userSchema);