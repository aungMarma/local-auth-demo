const mongoose 				  = require("mongoose"),
	  passportLocalMongoose   = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
	username: String,
	password: String
});

// You're free to define your User how you like. 
// Passport-Local Mongoose will 
// add a username, hash and salt field to store the username, the hashed password and the salt value.
// Additionally Passport-Local Mongoose adds some methods to your Schema
// such as User.serializeUser, User.deserializeUser and
// User.register, User.authenticate
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);
