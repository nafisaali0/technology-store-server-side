const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


//DB connection

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nlu12w4.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    
    // create DB for product
    const productCollection = client.db("productStore").collection("products")
    
    //receive product from client or create new product
    app.post('/product', async(req,res) => {
        const newProduct = req.body;
        console.log(newProduct)

        // send data to DB
        const result = await productCollection.insertOne(newProduct)
        res.send(result)
    }) 

    //now read new product 
    app.get('/product', async(req,res) => {
        const cursor = productCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//loaclhost 5000 show this text in root
app.get("/", (req, res) => {
  res.send("Technology Shop Server is running");
});
// showing text in cmd
app.listen(port, () => {
  console.log(`Server is running on PORT: ${port}`);
});
