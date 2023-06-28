const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get('/', (req, res)=> {
    res.sendFile("signup.html", {root:__dirname});
});

app.post("/", (req, res)=>{
    const fn = req.body.fname;
    const ln = req.body.lname;
    const email = req.body.email;

    var data = {
        members:[
            { //subscribing one person at a time
                email_address: email,
                status: "subscribed",
                merge_fields :{FNAME: fn, LNAME: ln}
            }
        ]
    }; //required by mailchimp API POST /lists/{list_id}

    const jsondata = JSON.stringify(data); //send it to mailchimp server to get subscribes
    const dc = "us21";
    const list_id = "c10892e6c0";
    const api_key = "27c4165583b4aaea29f8663b6303ade5-us21";    
    const url = `https://${dc}.api.mailchimp.com/3.0/lists/${list_id}`;

    const options = {
        method: "POST",
        auth: `kyang:${api_key}`
    };

    const request = https.request(url, options, (response)=>{
        if(response.statusCode === 200) {
            res.sendFile("success.html", {root:__dirname});
            console.log("code good" + response.statusCode);
        } else {
            res.sendFile("failure.html", {root:__dirname});
            console.log("code bad" + response.statusCode);
        }
        
        response.on("data", (data)=>{
            //console.log(JSON.parse(data)); //just monitoring the data on http request to POST to mailchimp subscriber lists
        });
    });

    // console.log(typeof(jsondata));
    request.write(jsondata);
    request.end();
    //console.log(fn, ln, em);
})

app.post("/failure", (req, res)=>{
    //a completion handler redirect user to home route
    res.redirect("/");
});


app.listen(process.env.PORT || 3000, ()=>{
    console.log("Listening on port 3000");
});

//27c4165583b4aaea29f8663b6303ade5-us21
//c10892e6c0  listid