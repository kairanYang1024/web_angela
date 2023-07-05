//jshint esversion:6
require('dotenv').config(); //must be configured at the top of entry point (root directory) to accesss env variables
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10; 

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {useUnifiedTopology: true});
console.log("DATABASE CONNECTED");
const userSchema = new mongoose.Schema({email:String, password:String});
const mysecret = process.env.SECRET;

// userSchema.plugin(encrypt, {secret: mysecret, encryptedFields: ["password"]}); //this need to be set up before setting up the mongoose model, extending functionality of Schemas
//no encryptedField encrypts the entire database, but we only need to encrypt pwd 

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res)=>{
    res.render("home");
});

app.get("/login", (req, res)=>{
    res.render("login");
});

app.get("/register", (req, res)=>{
    res.render("register");
});

app.post("/register", (req, res)=>{
    bcrypt.hash(req.body.password, saltRounds, (err, hash)=> {
        const newuser = new User({email:req.body.username, password:hash}); //level 3: irreversable hash
        newuser.save().then(()=>{
            console.log(`Successfully registered an user: ${newuser}`);
            res.render("secrets"); //goto secrets
        }).catch(()=>{
            console.log(`Registration Error! ${err}`);
        })
    });
});

app.post("/login", (req, res)=>{
    //validate user credentials
    const usrname = req.body.username;
    const pwd = req.body.password;

    User.findOne({email: usrname}).then((userMatched)=>{
        if(userMatched) {
            bcrypt.compare(pwd, userMatched.password, (error, result)=>{ //verify the password using bcrypt 
                if(result === true) {
                    console.log(`Successfully login an user: ${userMatched}`);
                    res.render("secrets");
                }
            });
        } // TODO: how to make the website alert user that the email/pwd is not correct and relog?
    }).catch((err)=>{
        console.log(`Login Error! ${err}`);
    });
});


app.listen(3000, ()=>{
  console.log("Server started on port 3000");
});