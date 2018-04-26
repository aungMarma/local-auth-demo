const mongoose 				  = require("mongoose"),
	  passportLocalMongoose   = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
	name: String,
	password: String
});

// add passport-local-mongoose functionalities to userSchema, thus to User
// such as User.serializeUser, User.deserializeUser and
// User.register, User.authenticate
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);
