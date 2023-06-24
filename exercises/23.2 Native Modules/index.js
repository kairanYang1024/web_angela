const fs = require("fs"); //import filesystem module
fs.writeFile("message.txt", "Hello from Node!\n", (err)=>{if (err) throw err; console.log("the file has been saved");});
// var stream = fs.createWriteStream("message.txt", {flags:'a'});
// stream.write("Hello from Angela and Kevin!\n");
// stream.close();
fs.writeFile("message.txt", "Hello from Kevin and Angela!\n", {flag:'a+'}, (err)=>{if (err) throw err; console.log("the file has been saved");});
fs.readFile("message.txt", "utf-8", (err, data)=>{if (err) throw err; console.log(data);}); //will display the readed data to the callback data param