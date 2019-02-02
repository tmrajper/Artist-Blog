var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

//GETS the landing page
router.get("/", function(req, res) {
   res.render("landing");
});

//GETS the register form
router.get("/register", function(req, res) {
   res.render("register"); 
});

//POST route for register, creates a new user with User model and saves username to DB and hashes and stores hashed password
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome To Artist Blog " + req.body.username);
            res.redirect("/artists"); 
        });
    });
});

//GETS login route
router.get("/login", function(req, res) {
    res.render("login");
});


//POST route for login, if login correct redirects to artists page, else goes back to /login
router.post("/login", passport.authenticate("local", {
    
    successRedirect: "/artists",
    failureRedirect: "/login"
    
}), function(req, res) {
});

//GETS logout route, logs user out
router.get("/logout", function(req, res) {
   req.logout();
   req.flash("success", "Logged You Out!");
   res.redirect("/artists");
});

module.exports = router;