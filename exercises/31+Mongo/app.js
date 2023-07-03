//jshint esversion:6

const MongoClient = require("mongodb").MongoClient;
const assert = require("assert"); //testing purpose

const url = 'mongodb://localhost:27017'; //the default port mongodb server uses
const dbName = 'myProject'; //db name
const client = new MongoClient(url); //create a client from connecting to this server address url

async function run() {
    try {
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();
        // Establish and verify connection
        await client.db("admin").command({ ping: 1 });
        console.log("Connected successfully to server");
        
        const db = client.db(dbName);
        await insertDocuments(db);
        console.log("insert successful");

        const cursor = showDocument(db);
        const allValues = await cursor.toArray(); //serialize the cursors
        console.log(allValues); //print the values

    } catch (err) {
        console.error(err);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

const insertDocuments = function(db) { //using the mongodb functions, to modify, return this a promise
    const collection = db.collection('fruits');
    // Wrap the insertMany operation in a Promise
    return collection.insertMany([
        {name:"Apple", score: 8, review:"great!"}, 
        {name:"Banana", score: 9, review:"excellent!"},
        {name:"Orange", score: 10, review:"extremely tasty and sweet!"}
    ]).then(res => console.log(`Inserted ${res.insertedCount} documents`),
        err => console.error(`Something went wrong: ${err}`));
}

const showDocument = function(db) {
    const collection = db.collection('fruits');
    return collection.find({});
}
run().catch(console.dir);
