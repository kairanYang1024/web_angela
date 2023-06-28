const express = require("express");
const app = express(); //top-level function exported from express module

// require('dns').lookup(require('os').hostname(), function (err, add, fam) {
//     console.log('addr: ' + add);
//   });

app.get("/", (req, res)=>{
    res.send("<h1>You connected to my server!</h1>"); //actually send HTML page to be rendered in 
}); //homepage GET, the URL is the root directory

app.get("/contact", (req, res)=>{
    res.send("Contact me at kyang2222@gmail.com");
});

app.get("/about", (req, res)=> {
    res.sendFile("./aboutme.html", {root: __dirname}); //send the file to the client, specify root to current folder by __dirname
});

app.get("/hobbies", (req, res)=> {
    res.sendFile("./hobby.html", {root: __dirname});
});

app.listen(3000, ()=>{ //callback listen
    console.log("server started on port 3000"); //this is the default port for server listening HTTP requests in convention setting (HTTP port itself is port 80)
}); //listen to the port 3000