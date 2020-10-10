const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const Schema = mongoose.Schema;
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: "The secret.",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/tweeter", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.set("useCreateIndex", true);

const tweetSchema = new Schema({
  writer: String,
  tweet: String,
});

const userSchema = new Schema({
  name: String,
  password: String,
  tweets: [tweetSchema],
});

userSchema.plugin(passportLocalMongoose);

const Tweet = mongoose.model("Tweet", tweetSchema);
const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

////////////////////////////////Requests for the root route///////////////////

app
  .route("/")

  .get((req, res) => {
    res.render("auth");
  });

////////////////////////////////Requests for the home route///////////////////

app
  .route("/home")

  .get((req, res) => {

    if (req.isAuthenticated()) {
      const userName = req.user.username;
      console.log(userName);
      Tweet.find({}, (err, foundTweets) => {
        res.render("home", {userName: userName, tweets: foundTweets});
      });

    } else {
      res.redirect("/");
    }
  })

  .post((req, res) => { 
    
    const userName = req.user.username;

    const tweet = new Tweet({
      writer: userName,
      tweet: req.body.tweet,
    });

    tweet.save();

    User.updateOne(
      { username: userName },
      { $push: { tweets: tweet } },
      (err, doc) => {
        if (err) console.log(err);
      }
    );

    res.redirect("/home");
  });

////////////////////////////////Requests for the register route///////////////////

app
  .route("/register")

  .get((req, res) => {
    res.render("register");
  })

  .post((req, res) => {
    User.register(
      { username: req.body.username },
      req.body.password,
      (err, user) => {
        if (err) {
          console.log(err);
          res.redirect("/register");
        } else {
          passport.authenticate("local")(req, res, () => {
            res.redirect("/home");
          });
        }
      }
    );
  });

////////////////////////////////Requests for the login route///////////////////

app
  .route("/login")

  .get((req, res) => {
    res.render("login");
  })

  .post((req, res) => {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });

    req.login(user, (err) => {
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local", {successRedirect: '/home',
        failureRedirect: '/register', failureFlash: true })(req, res, () => {
          res.redirect("/home");
        });
      }
    });
  });

app.listen(3000, function () {
  console.log("Server running at port 3000");
});
