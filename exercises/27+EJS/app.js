//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public")); //static resource folder: public/

const activities = ["Work hard!","Sleep late!", "Anxious for your miserable future!"]
const tasks = []

app.get("/", (req, res)=>{
    const day = date.getDate();
    res.render("list", {listTitle:day, activities:activities}); //filename inside views/ the second entry specifies the variable to parse into the template
});

app.get("/work", (req, res)=>{
    res.render("list", {listTitle:"Work List", activities:tasks}); 
});

app.get("/about", (req, res)=>{
    res.render("about");
});

app.post("/", (req, res)=> {
    const newstuff = req.body.garbage;
    if(req.body.list === "Work List") {
        tasks.push(newstuff);
        res.redirect("/work");
    } else {
        activities.push(newstuff);
        res.redirect("/");
    }
});


app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
