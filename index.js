const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken');


const port = process.env.PORT || 3000;
const app = express();

// milestone11ConceptualSession
// vKFzx1LQydEhC2Zk
const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    optionSuccessStatus: 200,
};

//middleware
app.use(cors());
app.use(express.json()); // explanation >> milstn11Conep-part3- 45mins


const uri = `mongodb+srv://${process.env.Db_User}:${process.env.Db_Password}@cluster0.qoryues.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const dbConnect = async () => {
    try {
        await client.db("admin").command({ ping: 1 });
        console.log("You successfully connected to MongoDB!");
    } catch (error) {
        console.log(error);

    }
}
dbConnect();


const posts = client.db('assignment11').collection('volunteerPosts');
const requests = client.db('assignment11').collection('volunteerRequests');



//Get all posts data from database

app.get('/volunteerPosts', async (req, res) => {
    try {
        const result = await posts.find().toArray();
        res.json(result);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get('/volunteerRequests', async (req, res) => {
    try {
        const result = await posts.find().toArray();
        res.json(result);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


//Get all posts data from database

app.get('/volunteerPostsBySort', async (req, res) => {
    try {
        const result = await posts.find().sort({deadline: 1}).toArray();
        res.json(result);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// add volunteer post from AddVolunteer component 
app.post('/addVolunteerPost', async (req, res) => {
    try {
        const postData = req.body;
        const result = await posts.insertOne(postData);
        res.json(result);
    } catch (error) {
        console.error("Error saving post:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


//get a single data from db using an ID for volunteerJobDetails component
app.get('/volunteerPosts/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await posts.findOne(query);
        
        res.json(result);
    } catch (error) {
        console.error("Error fetching job:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// save job application data in db from applyforposition component
app.post('/applications', async (req, res) => {
    try {
        const applicationData = req.body;
        const result = await requests.insertOne(applicationData);
        res.json(result);
    } catch (error) {
        console.error("Error saving bid:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


//Get all application data from database related to user email for MyApplication component
app.get('/volunteerRequests/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const query = { volunteerEmail: email };
        const result = await requests.find(query).toArray();
        res.json(result);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// get data for join request for JoinRequest component
app.get('/joinRequest/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const query = { organizer_email: email };
        const result = await requests.find(query).toArray();
        res.json(result);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});




//Get all post data from database related to user email for ManageMyPosts component
app.get('/myPosts/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const query = {organizer_email: email };
        const result = await posts.find(query).toArray();
        res.json(result);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// get data for update component 
app.get('/myPost/:id', async (req, res) => {
    try {
        const id = req.params.id;
        console.log("Received ID:", id);
        const query = { _id: new ObjectId(id) };
        console.log("Query:", query);
        const result = await posts.findOne(query);

        res.json(result);
    } catch (error) {
        console.error("Error fetching job:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});




app.put('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const postData = req.body; // Use jobData instead of updatedData
        const query = { _id: new ObjectId(id) };
        const options = { upsert: true }; // any new data will be posted by this 
        const updateDoc = {
            $set: { ...postData }, // Use jobData instead of updatedData
        };

        const result = await posts.updateOne(query, updateDoc, options);
        // Check if the update was successful
        if (result.modifiedCount === 1) {
            res.status(200).json({ message: "Job updated successfully" });
        } else {
            res.status(404).json({ error: "Job not found" });
        }
    } catch (error) {
        console.error("Error updating job:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});













// basic server part 
app.get('/', (req, res) => {
    res.send('Hello from Volunteer Server....')
})

app.listen(port, () => console.log(`Server running on port ${port}`)); 
