const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

//middlewares
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public")); //static resource folder: public/

//client to mongodb
mongoose.connect("mongodb://localhost:27017/wikiDB", {useUnifiedTopology: true});
console.log("CONNECTION OK");
const articleSchema = new mongoose.Schema({title:String, content:String});
const Article = new mongoose.model("article", articleSchema);

app.route("/articles")
.get((req, res)=>{
    //query the db and find all
    Article.find({}).then((articles)=>{
        res.send(articles);
    }).catch((err)=>{   
        console.log(`Error on fetching articles ${err}`);
    })
})
.post((req, res)=>{
    //no matter it's an HTML form element or a postman POST request, all can be logged by req.body. (if bodyparser is enabled)
    const newArticle = new Article({title: req.body.title, content: req.body.content});
    newArticle.save().then(()=>{
        res.send(`Sucessfully POST an article ${req.body.title}`);
    }).catch((err)=>{ 
        res.send(`Error when posting the article in req: ${err}`);
    });
})
.delete((req, res)=>{
    Article.deleteMany({}).then(()=>{
        res.send("Sucessfully DELETE all articles in the collection");
    }).catch((err)=>{
        res.send(`Error when deleting all articles: ${err}`);
    })
}); //you can also make these functions in another file and export to app.js, but for this scope, this is not necessary.

app.route("/articles/:articleTitle")
.get((req, res)=>{
    const reqTitle = req.params.articleTitle;
    Article.findOne({title:reqTitle}).then((myArticle)=>{
        if(myArticle) {
            res.send(myArticle);
        } else {
            res.send(`The article you want: ${reqTitle} does not exist in our database, sorry:(`);
        }
    }).catch((err)=>{   
        res.send(`Error on fetching article ${myArticle}: ${err}`);
    });
})
.put((req, res)=>{
    const reqTitle = req.params.articleTitle;
    //do put this field because it will then overwrite the entire article, otherwise, it will overwrite only the particular fields.
    //also, the req.body.title/content is attached to the PUT request
    Article.findOneAndUpdate({title:reqTitle}, {title: req.body.title, content: req.body.content}, {overwrite:true}).then(()=>{
        res.send(`Successfully updated article: ${reqTitle} to ${req.body.title}`);
    }).catch((err)=>{
        res.send(`Failed to update article: ${reqTitle} to ${req.body.title}, error: ${err}`);
    })
}).patch((req, res)=>{
    const reqTitle = req.params.articleTitle;
    // the exact field that's going to be updated are contained in the req.body object and is specified by the PATCH request sender (the client), 
    // and to leverage this in just using the js object in the update field. 
    Article.findOneAndUpdate({title:reqTitle}, {$set: req.body}).then(()=>{
        res.send(`(PATCH) Successfully updated article: ${req.body}`);
    }).catch((err)=>{
        res.send(`(PATCH) Failed to update article: ${req.body}, error: ${err}`);
    })
}).delete((req, res)=>{
    const reqTitle = req.params.articleTitle;
    Article.deleteOne({title: reqTitle}).then(()=>{
        res.send(`Sucessfully DELETE article: ${reqTitle}`);
    }).catch((err)=>{
        res.send(`Error when deleting the article ${reqTitle}: ${err}`);
    })
});


app.listen(3000, function(){
    console.log("Server started on port 3000.");
});
  