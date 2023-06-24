// var generateName = require("sillyname"); CJS
import generateName from "sillyname"; // EJM style
import * as h from "superheroes";
import fs from 'fs';

for(var i = 0; i < 100; i++) {
    var flag = Math.floor(Math.random() * 2);
    var name = "lamename";
    switch(flag) {
        case 0:
            name = h.random(); //generate a superhero name
            break;
        case 1:
            name = generateName(); //generate a silly name
            break;
        default:
            break;
    }
    if(i == 0) fs.writeFile("rollcall.txt", name + "\n", (err)=>{if(err) throw err;});
    else fs.writeFile("rollcall.txt", name + "\n", {flag: "a+"}, (err)=>{if(err) throw err;});
}

fs.readFile("rollcall.txt", "utf-8", (err, data)=>{
    if(err) throw err;
    console.log(data);
});
