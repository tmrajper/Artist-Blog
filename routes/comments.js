var express = require("express");
var router = express.Router({mergeParams: true});
var Artist = require("../models/artist");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Checks if user is logged in, GETS the create new comment route
router.get("/new", middleware.isLoggedIn, function(req, res) {
    console.log(req.params.id);
    Artist.findById(req.params.id, function(err, artist) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {artist: artist});
        }
    })
});

//POST routes for comments
router.post("/", middleware.isLoggedIn, function(req, res) {
   Artist.findById(req.params.id, function(err, artist) {
      if (err) {
          console.log(err);
          res.redirect('/artists');
      } else {
          Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    req.flash("error", "Something went wrong!");
                    console.log(err);
                } else {
                    //add username and id to comment and save comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //Save Comment
                    comment.save();
                    //Push comment onto Artist
                    artist.comments.push(comment);
                    artist.save();
                    console.log(comment);
                    req.flash("success", "Successfully Created Comment!");
                    res.redirect("/artists/" + artist._id);
                }
          })
      }
   });
});

//GETS edit route for comments. Checks comment ownership, if true allows for edits on the comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComments) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {artist_id: req.params.id, comment: foundComments});
        }
    });
});

//PUTS newly edited comment in correct position
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
       if (err) {
           res.redirect("back");
       } else {
           res.redirect("/artists/" + req.params.id);
       }
    });
});

//Comments Destroy Route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    //find by id and remove
    Comment.findOneAndDelete(req.params.comment_id, function(err) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted!");
            res.redirect("/artists/" + req.params.id);
        }
    });
});

module.exports = router;