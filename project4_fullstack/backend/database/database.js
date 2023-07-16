const mongoose = require("mongoose");

const { MONGO_URI } = process.env;

exports.connect = () => {
    mongoose.connect(MONGO_URI, {useUnifiedTopology:true}).then(()=>{
        console.log("Connected to database")
    }).catch((err)=>{
        console.log("Failed to connect to database, terminating the application.");
        console.error(err);
        process.exit(1); //exit(1) to signify abnormal exit
    });
}