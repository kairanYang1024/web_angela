const mongoose = require("mongoose");

const url = 'mongodb://127.0.0.1:27017/fruitsDB'; //connect to the server, look for fruitDB, if not, create it

async function run() {
    try {
        await mongoose.connect('mongodb://localhost:27017/fruitsDB', {
            useUnifiedTopology: true,
        });
        console.log("CONNECTION OK");

        const fruitSchema = new mongoose.Schema({
            name: {type:String, required: [true, "You need to add a name for the fruit."]},
            rating:{type:Number, min:1, max:10},
            review:String
        });

        const Fruit = new mongoose.model("Fruit", fruitSchema);

        const orange = new Fruit({
            name:"Orange",
            rating: 10,
            review:"fantastic!"
        });

        const banana = new Fruit({
            name:"Banana",
            rating: 6,
            review:"slimy."
        });

        const kiwi = new Fruit({
            name : "Kiwi",
            rating: 3,
            review:"sour and hurt my tongue."
        });

        // Insert fruits
        // await fruit.save();
        // console.log("inserted an apple!");

        await Fruit.insertMany([orange, banana, kiwi]);
        console.log("insert success!");

        // Update fruit
        await Fruit.updateOne({name:"Banana"}, {name:"Peach"});

        // Find and print fruits
        const fruits = await Fruit.find({});
        console.log("find the docs");
        
        fruits.forEach((fruit)=>{
            console.log(`I am ${fruit.name}, I have a rating of ${fruit.rating} and I am delicious!`);
        });

        // embedding documents
        const humanSchema = new mongoose.Schema({
            name:String,
            age:Number,
            favoriteFruit: fruitSchema
        });

        //establishing relationship and embed
        const Human = mongoose.model("Human", humanSchema);
        await Human.deleteMany({name: "Amy"}); //just wipe out the entire table
        console.log("Cleared data before insertion");
        const human = new Human({name: "Amy", age:"12", favoriteFruit: orange});
        await human.save(); //this insertion promise is called repeatedly
        
        const humans = await Human.find({})
        console.log(`find the docs ${humans}`);
        humans.map((human)=>{
            // console.log(typeof human);
            console.log(`I am ${human.name}, and I am ${human.age} years old. I like to eat ${human.favoriteFruit.name}`);
        });

    } catch(err) {
        console.log("CONNECTION IS BAD")
        console.log(err)
    } finally {
        mongoose.connection.close(); // close the connection after the last operation
    }
}

run();

// const Human = new mongoose.model("Human", humanSchema);
// const human = new Human({
//     name: "John",
//     age: 36
// });

// human.save().then(()=>{
//     console.log("Inserted a human!");
//     mongoose.connection.close();
// }).catch(err=>{
//     console.log("FAIL TO SAVE AN OBJECT");
//     console.log(err);
// });