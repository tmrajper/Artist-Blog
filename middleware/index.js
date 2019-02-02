var Artist = require("../models/artist");
var Comment = require("../models/comment");

var middlewareObj = {};

//Checks if user owns a certain posts and only allows owner to make edits or delete. Also Checks if user is logged in
middlewareObj.checkArtistOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Artist.findById(req.params.id, function(err, foundArtist) {
        if (err) {
            req.flash("error", "Artist Not Found!");
            res.redirect("back");
        } else {
            
            if (!foundArtist) {
                req.flash("error", "Item Not Found!");
                return res.redirect("back");
            }
            
            if (foundArtist.author.id.equals(req.user._id)) {
                next();   
            } else {
                req.flash("error", "You don't have permission to do that!");
                res.redirect("back");
            }
        }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};

//Checks if user is logged in, and allows only the owner of the comment to edit or delete comment
middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            req.flash("error", "Artist Not Found!");
            res.redirect("back");
        } else {
            if (foundComment.author.id.equals(req.user._id)) {
                next();   
            } else {
                req.flash("error", "You don't have permission to do that!")
                res.redirect("back");
            }
        }
        });
    } else {
        req.flash("error", "You need to be loggedin to do that!");
        res.redirect("back");
    }
};

//Checks if user is logged in
middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
}

//Exports middleware object so it can be required in other files
module.exports = middlewareObj;