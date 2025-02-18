//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const lodash = require("lodash");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {useUnifiedTopology: true})
console.log("CONNECTION OK");

const PostSchema = new mongoose.Schema({title: String, content: String});
const Post = new mongoose.model("post", PostSchema); //define a Post class and collection using the PostSchema defined above

app.get("/", (req, res)=>{
  Post.find({}).then((posts)=>{
    //if empty, no need to insert default
    res.render("home", {homeStartingContent: homeStartingContent, posts: posts});
  }).catch((err)=>{
    console.log(`An error occurred when fetching the database: ${err}`);
  });
});

app.get("/about", (req, res)=>{
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", (req, res)=>{
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", (req, res)=>{
  res.render("compose");
});

app.get("/posts/:blogId", (req, res)=>{
  console.log(req.params.blogId); // check the blog post page by ID, not by name, reduce complexity to O(1)

  Post.findOne({_id: req.params.blogId}).then((post)=>{
    if(!post) {
      res.render("failure", {blogId: req.params.blogId});
    } else {
      res.render("post", {blogTitle: post.title, blogPassage: post.content});
    }
  }).catch((err)=>{
    console.log(`Error when fetching blogpost ID=${req.params.blogId}`)
  });
});

app.post("/compose", (req, res)=>{
  // what's being stored in the req is the form's input, not button...
  const post = new Post({title: req.body.blogTitle, content: req.body.blogPassage});
  post.save();
  // posts.push(publishContent);
  console.log(`Post ${post} is inserted into the database`);
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
