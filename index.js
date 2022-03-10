const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const { query } = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zetdm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const outdoorGear = client.db("outdoorGear");
    const productCollection = outdoorGear.collection("products");
    const orderCollection = outdoorGear.collection("orders");
    const reviewCollection = outdoorGear.collection("reviews");
    const userCollection = outdoorGear.collection("users");

    // Post User Api
    app.post("/user", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.json(result);
    });
    app.put("/user", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = {
        $set: { user },
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    });

    // Get Admin Api
    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      // console.log(user);
      res.json({ admin: isAdmin });
    });

    // Admin Api
    app.put("/user/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = {
        $set: { role: "admin" },
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

    // Post Review API
    app.post("/review", async (req, res) => {
      const data = req.body;
      const filter = { email: data.email };
      const options = { upsert: true };
      const updateDoc = {
        $set: { data },
      };
      const result = await reviewCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
    // Get Review Api
    app.get("/review", async (req, res) => {
      const cursor = reviewCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    // Post Order API
    app.post("/order", async (req, res) => {
      const data = req.body;
      const result = await orderCollection.insertOne(data);
      res.json(result);
    });
    // Get Order Api
    app.get("/order", async (req, res) => {
      const cursor = orderCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });
    // Delete Order API
    app.delete("/order/:id", async (req, res) => {
      const id = req.params.id;
      const item = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(item);
      res.json(result);
    });

    // Product Post API
    app.post("/products", async (req, res) => {
      const data = req.body;
      const result = await productCollection.insertOne(data);
      res.json(result);
    });
    // GET API all data
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });
    // GET API all data
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();wgF5YpZGdYr5xAN1
  }
}
run().catch(console.dir);
app.get("/", async (req, res) => {
  res.send("Hello");
});
app.listen(port, () => {
  console.log("Server is runing on PORT : ", port);
});
