//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public")); //static resource folder: public/

//use mongo and mongoose instead to set up default data
mongoose.connect("mongodb://localhost:27017/todolistDB", {useUnifiedTopology: true});
console.log("CONNECTION OK");
const itemSchema = new mongoose.Schema({name:String});
const Item = new mongoose.model("todoItem", itemSchema);

const item1 = new Item({name: "Programming"});
const item2 = new Item({name: "Watching online lecture"});
const item3 = new Item({name: "Progressing"});
const initialList = [item1, item2, item3];

//a list schema accepts a field of an array of 'itemSchema's
const listSchema = new mongoose.Schema({name:String, items:[itemSchema]}); 
const List = new mongoose.model("List", listSchema);

//clear the db every time the server boot up for demo purpose, don't do that in real production!
// Item.deleteMany({});

app.get("/", (req, res)=>{
    Item.find({}).then((items)=>{
        //check for emptiness
        if(items.length === 0) {
            Item.insertMany(initialList);
            console.log(`Insert initial items (${initialList.length} items) successfully`);
            res.redirect("/"); //running app.get("/") again to have items loaded in array ${items} by calling find() again
        }
        //filename inside views/ the second entry specifies the variable to parse into the template
        res.render("list", {listTitle:"Today", activities:items}); 
    }).catch((err)=>{
        console.log(`An error occurred when fetching the database: ${err}`);
    });
});

app.get("/:listName", (req, res)=>{
    //access current name if found in db, create one if not
    const listName = req.params.listName;
    List.findOne({name:listName}).then((foundList)=>{
        if(!foundList) {
            const list = new List({name:listName, items:initialList});
            list.save();
            res.redirect("/" + listName); //redirect to the current blog list
        } else {
            res.render("list", {listTitle:foundList.name, activities:foundList.items}); 
        }
    }).catch((err)=>{
        console.log(`Error when fetching the list associated with listName: ${listName}, ${err}`);
    });
});

app.post("/", (req, res)=> {
    const itemName = req.body.newItem; //this is sent as a raw string from <input> in <form>
    const listName = req.body.list;
    const newItem = new Item({name:itemName});

    if(listName === "Today") { //default name
        //create a new item and insert it to db
        newItem.save();
        console.log(`Logging ${newItem} successfully.`);
        res.redirect("/");
    } else { //search list collection and insert it
        List.findOne({name:listName}).then((foundList)=>{
            foundList.items.push(newItem); //accessing the js array and push it
            foundList.save();
            res.redirect("/" + listName);
        }).catch((err)=>{
            console.log(`Error when fetching the list associated with listName: ${listName}, ${err}`);
        });
    }
});

app.post("/delete", (req, res)=> {
    //{checkbox: 'on'} 'on' means an event is recorded (onChange)
    const checkedItemId = req.body.checkbox;
    const checkedListName = req.body.listName;
    if(checkedListName === "Today") { //remove directly from the items collection
        Item.findByIdAndRemove(checkedItemId).then(()=>{
            console.log(`Remove item ${checkedItemId} successfully!`);
            res.redirect("/");
        }).catch((err)=>{
            console.log(`Error in deleting the item ${checkedItemId}: ${err}`);
        });
    } else { //remove the embedded item from the lists collection, little bit complex
        List.findOneAndUpdate({name: checkedListName}, {$pull: {items:{_id:checkedItemId}}}).then((foundList)=>{
            console.log(`Remove item ${checkedItemId} from list ${checkedListName} successfully!`);
            res.redirect("/" + checkedListName);
        }).catch((err)=>{
            console.log(`Error in deleting the item ${checkedItemId} from list ${checkedListName}: ${err}`);
        })
    } 
});


app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
