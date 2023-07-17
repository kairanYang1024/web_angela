require("dotenv").config();
require("./database/database.js").connect();
const express = require("express");
const cors = require("cors");

const app = express(); //instance of the package express
const router = require("./routes/index");
const auth = require("./middleware/auth");

const port = process.env.PORT || 3000;

app.use(express.json()); // middleware for parsing application/json, formerly body-parser
app.use(express.urlencoded({ extended: true })); //for parsing HTML form data, formerly body-parser
app.use(cors());

app.get("/", (req, res)=>{
    res.send({msg:"meow"});
});

app.post("/hello", auth, (req, res) => { //just for testing middleware purpose
    res.status(200).send("Hello :) ");
});

app.use("/api", router); //pack router routes to /api, in reality it looks like /api/register, /api/login, ...

app.listen(port, ()=>{
    console.log(`app is listened at http://localhost:${port}`);
});