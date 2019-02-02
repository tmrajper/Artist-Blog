var mongoose = require("mongoose");

//Creates a schema for a new post and matches the post to the creator of the post.
var artistSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
      id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
      },
      username: String
    },
    //Comments are embedded in the artists posts schema, links the artist post to its comments
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }    
    ]
});

//Exports the Artist Model
module.exports = mongoose.model("Artist", artistSchema);