var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

//Creates a User Schema
var UserSchema = mongoose.Schema({
    username: String,
    password: String
});

//Calls for passport-local-mongoose so its methods can called for authentication
UserSchema.plugin(passportLocalMongoose);

//Exports User Model
module.exports = mongoose.model("User", UserSchema);