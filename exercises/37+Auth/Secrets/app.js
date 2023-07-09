//jshint esversion:6

require('dotenv').config(); //must be configured at the top of entry point (root directory) to accesss env variables
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
// const bcrypt = require("bcrypt");
// const saltRounds = 10; 
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local"); //this line is required
const passportLocalMongoose = require("passport-local-mongoose");
const e = require('express');

const app = express();

app.set('view engine', 'ejs');

//middlewares
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(session({
    secret: "Iamababychick", //long string put in the .env file
    resave: false, 
    saveUninitialized: false, //implementing login sessions, reducing server storage usage and comply before setting a cookie
    // cookie: { secure: true }
  })); 

app.use(passport.initialize()); //intialize an instance for incoming requests, allowing authentication strategies to be applied.
app.use(passport.session());  //Middleware that will restore login state from a session. Web applications typically use sessions to maintain login state between requests.


mongoose.connect("mongodb://localhost:27017/userDB", {useUnifiedTopology: true});
console.log("DATABASE CONNECTED");
const userSchema = new mongoose.Schema({username:String, password:String, secret:String});

//doing passport with mongoose instead of encrypt
userSchema.plugin(passportLocalMongoose); //does hashing and salting the passwords

// userSchema.plugin(encrypt, {secret: mysecret, encryptedFields: ["password"]}); //this need to be set up before setting up the mongoose model, extending functionality of Schemas
// no encryptedField encrypts the entire database, but we only need to encrypt pwd 

const User = new mongoose.model("User", userSchema);

// passport.use(User.createStrategy());
//but as soon as it redirected to the secrets route, it was deauthenticated. 
//I was being redirected to the login page instead of the secrets page since I was no longer an authenticated user.

//create local login strategy for the User model (collection)
passport.use(new LocalStrategy(User.authenticate()));
//enable the server to create and destroy cookies from the mongoose database & collection
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res)=>{
    res.render("home");
});

app.get("/login", (req, res)=>{
    res.render("login");
});

app.get("/register", (req, res)=>{
    res.render("register");
});

app.get("/logout", (req, res)=>{
    req.logout((err) => {
        if (err) { return next(err); }
        //manually destroy the session and clear the cookie once logged out
        req.session.destroy(err => {
            if (err) {
                console.log(err);
            } else {
                res.status(200).clearCookie("connect.sid", { path: "/" }).redirect("/");
            }
        });
      });
});

app.get("/secrets", (req, res)=>{
    //look thru the User who submitted a secret
    User.find({"secret":{$ne: null}}).then((foundUsers)=>{
        if(foundUsers) {
            res.render("secrets", {secretUsers: foundUsers}); //render the secret messages
        }
    }).catch((err)=>{
        console.log(`Error in finding user IDs with secret posts: ${err}`)
    });
});

app.get("/submit", (req, res)=>{
    if(req.isAuthenticated()) {
        res.render("submit");
    } else {
        res.redirect("/login");
    }
});

app.post("/submit", (req, res)=>{
    const submittedSecret = req.body.secret;
    User.findById(req.user._id.toString()).then((foundUser)=>{
        if(foundUser) {
            foundUser.secret = submittedSecret;
            foundUser.save();
            res.redirect("/secrets");
        } else {
            res.send("This user does not exist");
        }
    }).catch((err)=>{
        console.log(`find ID error in the /submit route to check the user identity via request: ${err}`);
    });
});

// bcrypt.hash(req.body.password, saltRounds, (err, hash)=> {
//     const newuser = new User({email:req.body.username, password:hash}); //level 3: irreversable hash
//     newuser.save().then(()=>{
//         console.log(`Successfully registered an user: ${newuser}`);
//         res.render("secrets"); //goto secrets
//     }).catch(()=>{
//         console.log(`Registration Error! ${err}`);
//     })
// });
app.post("/register", (req, res)=>{
    //with passport in the new version (from documentation)
    User.register(new User({username: req.body.username}), req.body.password, function(err, newuser) {
        if (err) {
            console.log(`Registration Error! ${err}`);
            res.render('register');
        } else {
            passport.authenticate('local')(req, res, ()=>{
                res.redirect('/secrets');
            });
        }
    });
});

//validate user credentials
// const usrname = req.body.username;
// const pwd = req.body.password;
// User.findOne({email: usrname}).then((userMatched)=>{
//     if(userMatched) {
//         bcrypt.compare(pwd, userMatched.password, (error, result)=>{ //verify the password using bcrypt 
//             if(result === true) {
//                 console.log(`Successfully login an user: ${userMatched}`);
//                 res.render("secrets");
//             }
//         });
//     } // TODO: how to make the website alert user that the email/pwd is not correct and relog?
// }).catch((err)=>{
//     console.log(`Login Error! ${err}`);
// });
app.post("/login", passport.authenticate('local', { failureRedirect:'/login'}), (req, res)=>{
    res.redirect('/secrets');
});

app.listen(3000, ()=>{
  console.log("Server started on port 3000");
});