const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", (req, res)=>{
    res.sendFile("index.html", {root: __dirname});
});

app.post("/", (req, res)=>{
    //make a get request to the OpenWeather data
    const query = req.body.cityName;
    const apiKey = "4af26153df9ecc7359601a72655f8ae1";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

    https.get(url, (response)=>{ //fetched the response of this API call
        response.on("data", (data)=>{
            const weatherData = JSON.parse(data); 
            console.log(weatherData); //make the fetched json data a javascript object
            const temp = weatherData.main.temp;
            console.log(`${temp} degree celcius`);
            const description = weatherData.weather[0].description;
            
            //icon name and weather id, also fetch them from the response json
            const iconid = weatherData.weather[0].id;
            const icon = weatherData.weather[0].icon; //icon name
            //this is more customizable, 2x can be configured as well
            const iconurl = "https://openweathermap.org/img/wn/" + icon + "@2x.png"; 
            //only one send for an app.get() method
            res.write(`<h1>The temperature at ${query} is ${temp} celcius and is currently ${description}</h1>`); 
            res.write(`<img src=${iconurl} alt=weather icon>`);
            res.send();
            
        });
    });
});


app.listen(3000, ()=>{
    console.log("port is listening on port 3000");
});

    // const object = {
    //     name:"Kevin",
    //     favoriteFood:"sushi"
    // };
    // const ring = JSON.stringify(object); //stringify an object to json
    // console.log(ring);