const express = require("express");
const bodyParser = require("body-parser");
const app = express(); //setting up the app

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", (req, res)=>{
    res.sendFile("index.html", {root: __dirname});
});

app.post("/bmicalculator", (req, res)=>{
    console.log(req.body);
    var height = Number(req.body.height); //string to int
    var weight = Number(req.body.weight); //string to int
    var bmi = getBmi(height, weight);
    var comment = getComment(bmi);
    res.send(`<h1>Your BMI value is ${bmi}.</h1>
        <h2>${comment}</h2>`);
});

app.listen(3000, ()=>{
    console.log("server is listening to port 3000");
});

function getBmi(height, weight) {
    return weight / (height * height);
}

function getComment(bmi) {
    if(bmi <= 18) {
        return "You are too thin, be sure to intake more proteins!";
    } else if(bmi <= 24 && bmi > 18) {
        return "Keep maintaining a healthy lifestyle and diet!";
    } else if(bmi <= 28 && bmi > 24) {
        return "Ensure a balanced eating habit can boost your health!";
    } else if(bmi > 28) {
        return "You need to take immediate measure to lose weight, high obesity is related to multiple hard-treated diseases like diabetes.";
    } else {
        return "Ensure that you entered valid unit";
    }
}