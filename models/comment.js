var mongoose = require("mongoose");
 
 //Comment Schema
var commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

//Exports Comment Model
module.exports = mongoose.model("Comment", commentSchema);