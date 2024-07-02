const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const port = process.env.PORT || 3000;
const app = express();



//middleware
app.use(cors());
app.use(express.json()); // 


const uri = `mongodb+srv://${process.env.Db_User}:${process.env.Db_Password}@cluster0.qoryues.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const usersCollection =client.db('groupDatabase').collection('users');


const dbConnect = async () => {
    try {
        await client.db("admin").command({ ping: 1 });
        console.log("You successfully connected to MongoDB!");
    } catch (error) {
        console.log(error);

    }
}
dbConnect();


// write your api after this line 










// write your api above this 
// basic server part 
app.get('/', (req, res) => {
    res.send('Hello from Volunteer Server....')
})

app.listen(port, () => console.log(`Server running on port ${port}`)); 
