var express = require("express");
var router = express.Router();
var Artist = require("../models/artist");
var middleware = require("../middleware");

//Gets the Artists Page and displays all posts, GET request
router.get("/", function(req, res) {
    
    Artist.find({}, function(err, allArtists) {
        if (err) {
            console.log(err)
        } else {
            res.render("artists/index", {artists: allArtists, currentUser: req.user});
        }
    });
});

//POST request, middleware checks if user is logged in, if true user can post artists.
router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username 
    };
    var newArtist = {name : name, image: image, description: desc, author: author};
    Artist.create(newArtist, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            console.log(newlyCreated);
            res.redirect("/artists");
        }
    });
    
});

//GET request gets the new page for creating new artist
router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("artists/new"); 
});

//GETS the show page for a certain artist, also populates the appropriate comments
router.get("/:id", function(req, res) {
    Artist.findById(req.params.id).populate("comments").exec(function(err, foundArtist) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundArtist);
            res.render("artists/show", {artist: foundArtist});
        }
    });
});

//GETS the edit route, middleware checks for owndership, and correct owner can edit artist
router.get("/:id/edit", middleware.checkArtistOwnership, function(req, res) {
    Artist.findById(req.params.id, function(err, foundArtist) {
        if (err) {
            req.flash("error", "Artist Not Found!");
        } else {
            res.render("artists/edit", {artist: foundArtist});
        }
        });
});

//PUTS newly edited artist information in the correct position
router.put("/:id", middleware.checkArtistOwnership, function(req, res) {
   Artist.findByIdAndUpdate(req.params.id, req.body.artist, function(err, updatedArtist) {
       if (err) {
           res.redirect("/artists");
       } else {
           res.redirect("/artists/" + updatedArtist._id);
       }
   }); 
});

//Destroy Artist Route
router.delete("/:id", middleware.checkArtistOwnership, function(req, res) {
   Artist.findOneAndDelete(req.params.id, function(err) {
      if (err) {
          res.redirect("/artists");
      } else {
          res.redirect("/artists");
      }
   }); 
});

module.exports = router;