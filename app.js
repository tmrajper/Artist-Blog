//Requires various packages for the back end
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var methodOverride = require("method-override");
var flash = require("connect-flash");
var commentRoutes = require("./routes/comments");
var artistRoutes = require("./routes/artists");
var indexRoutes = require("./routes/index");


app.use(flash());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
//Connects to mongoDB and creates/uses database with name artist_blog
mongoose.connect("mongodb://localhost:27017/artist_blog", {useNewUrlParser: true});
app.use(express.static(__dirname + "/public"));
//Used to make PUT requests
app.use(methodOverride("_method"));

app.use(require("express-session")({
    secret: "This is my Artist Blog Website",
    resave: false,
    saveUninitialized: false
}));

//Initializes User authentication
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//allows current user to be called in different parts of the project
app.use(function(req, res, next) {
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

//Makes writing routes easier
app.use("/", indexRoutes);
app.use("/artists/:id/comments", commentRoutes);
app.use("/artists", artistRoutes);

//Starts server
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Artist Blog has Started!");
});