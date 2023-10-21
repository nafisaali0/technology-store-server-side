const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//DB connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nlu12w4.mongodb.net/?retryWrites=true&w=majority`;

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

    // create DB for store all products
    const productCollection = client.db("productStore").collection("products");
    // create DB for store cart product
    const cartCollection = client
      .db("productStore")
      .collection("cartCollection");

    //receive product from client or create new product using post method
    app.post("/product", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);

      // send data to DB
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    //read or get all products using get method
    app.get("/product", async (req, res) => {
      const cursor = productCollection.find();

      // send data to DB in array formet
      const result = await cursor.toArray();
      res.send(result);
    });

    //read or get all products by specific brand using get method
    app.get("/product/:brand", async (req, res) => {
      const brand = req.params.brand;
      const query = { brand: brand };

      // send data to DB in array formet
      const result = await productCollection.find(query).toArray();
      res.send(result);
    });

    //read or get specific products by id using get method
    app.get("/product/id/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    // update products info by client response
    app.put("/product/id/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedProductInfo = req.body;
      const updatedProduct = {
        $set: {
          photo: updatedProductInfo.photo,
          name: updatedProductInfo.name,
          brand: updatedProductInfo.brand,
          type: updatedProductInfo.brand,
          price: updatedProductInfo.price,
          rating: updatedProductInfo.rating,
          description: updatedProductInfo.description,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        updatedProduct,
        options
      );
      res.send(result);
    });

    //cart DB : when client click (add to cart) button

    //receive or create cart product from client
    app.post("/cart", async (req, res) => {
      const cartNewProduct = req.body;
      console.log(cartNewProduct);

      // send data to DB
      const result = await cartCollection.insertOne(cartNewProduct);
      res.send(result);
    });

    //read or get all cart products using get method
    app.get("/cart", async (req, res) => {
      const cursor = cartCollection.find();

      // send data to DB
      const result = await cursor.toArray();
      res.send(result);
    });

    //read or get specific crat products by id using get method
    app.get("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      // send data to DB
      const result = await cartCollection.findOne(query);
      res.send(result);
    });

    // delete crat data from DB and server also client using delete method
    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      // send data to DB
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });
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
